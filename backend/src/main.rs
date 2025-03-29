fn main() {
    println!("Hello, world!");
}
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128,
    CosmosMsg, BankMsg, StdError,
};
use serde::{Deserialize, Serialize};

// Define the contract state
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Item {
    pub seller: String,         // Seller's address
    pub price: Uint128,         // Price in uxion
    pub description: String,    // Item description
    pub sold: bool,             // Whether the item is sold
    pub buyer: Option<String>,  // Buyer's address (if sold)
    pub delivered: bool,        // Delivery status
}

// Define the instantiation data
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct InstantiateMsg {
    pub price: Uint128,
    pub description: String,
}

// Define the execute messages
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    BuyItem {},              // Buyer purchases the item
    ConfirmDelivery {},      // Seller confirms delivery
    RefundBuyer {},          // Refund buyer if delivery fails
}

// Define the query messages
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetItem {},
}

// Define the query response
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct ItemResponse {
    pub seller: String,
    pub price: Uint128,
    pub description: String,
    pub sold: bool,
    pub buyer: Option<String>,
    pub delivered: bool,
}

// State storage
const ITEM_KEY: &[u8] = b"item";

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let item = Item {
        seller: info.sender.to_string(),
        price: msg.price,
        description: msg.description,
        sold: false,
        buyer: None,
        delivered: false,
    };
    deps.storage.set(ITEM_KEY, &bincode::serialize(&item).map_err(|e| StdError::generic_err(format!("Serialization error: {}", e)))?);
    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::BuyItem {} => buy_item(deps, env, info),
        ExecuteMsg::ConfirmDelivery {} => confirm_delivery(deps, env, info),
        ExecuteMsg::RefundBuyer {} => refund_buyer(deps, env, info),
    }
}

fn buy_item(deps: DepsMut, _env: Env, info: MessageInfo) -> StdResult<Response> {
    let mut item: Item = bincode::deserialize(&deps.storage.get(ITEM_KEY).ok_or_else(|| {
        StdError::generic_err("Item not found")
    })?).map_err(|e| StdError::generic_err(format!("Deserialization error: {}", e)))?;

    if item.sold {
        return Err(StdError::generic_err("Item already sold"));
    }

    // Check if the buyer sent enough funds
    let sent_funds = info.funds.iter().find(|coin| coin.denom == "uxion").map(|coin| coin.amount).unwrap_or(Uint128::zero());
    if sent_funds < item.price {
        return Err(StdError::generic_err("Insufficient funds"));
    }

    // Update item state
    item.sold = true;
    item.buyer = Some(info.sender.to_string());
    deps.storage.set(ITEM_KEY, &bincode::serialize(&item).map_err(|e| StdError::generic_err(format!("Serialization error: {}", e)))?);

    Ok(Response::new()
        .add_attribute("method", "buy_item")
        .add_attribute("buyer", info.sender))
}

fn confirm_delivery(deps: DepsMut, _env: Env, info: MessageInfo) -> StdResult<Response> {
    let mut item: Item = bincode::deserialize(&deps.storage.get(ITEM_KEY).ok_or_else(|| {
        StdError::generic_err("Item not found")
    })?).map_err(|e| StdError::generic_err(format!("Deserialization error: {}", e)))?;

    if info.sender.to_string() != item.seller {
        return Err(StdError::generic_err("Only seller can confirm delivery"));
    }
    if !item.sold {
        return Err(StdError::generic_err("Item not sold yet"));
    }
    if item.delivered {
        return Err(StdError::generic_err("Delivery already confirmed"));
    }

    // Mark as delivered and release funds to seller
    item.delivered = true;
    deps.storage.set(ITEM_KEY, &bincode::serialize(&item).map_err(|e| StdError::generic_err(format!("Serialization error: {}", e)))?);

    let payment = BankMsg::Send {
        to_address: item.seller.clone(),
        amount: vec![cosmwasm_std::Coin {
            denom: "uxion".to_string(),
            amount: item.price,
        }],
    };

    Ok(Response::new()
        .add_message(CosmosMsg::Bank(payment))
        .add_attribute("method", "confirm_delivery"))
}

fn refund_buyer(deps: DepsMut, _env: Env, info: MessageInfo) -> StdResult<Response> {
    let mut item: Item = bincode::deserialize(&deps.storage.get(ITEM_KEY).ok_or_else(|| {
            StdError::generic_err("Item not found")
        })?).map_err(|e| StdError::generic_err(format!("Deserialization error: {}", e)))?;

    if info.sender.to_string() != item.seller {
        return Err(StdError::generic_err("Only seller can issue refund"));
    }
    if !item.sold {
        return Err(StdError::generic_err("Item not sold yet"));
    }
    if item.delivered {
        return Err(StdError::generic_err("Item already delivered"));
    }

    // Refund buyer and reset item state
    let buyer = item.buyer.clone().ok_or_else(|| StdError::generic_err("No buyer found"))?;
    item.sold = false;
    item.buyer = None;
    deps.storage.set(ITEM_KEY, &bincode::serialize(&item).map_err(|e| StdError::generic_err(format!("Serialization error: {}", e)))?);

    let refund = BankMsg::Send {
        to_address: buyer.clone(),
        amount: vec![cosmwasm_std::Coin {
            denom: "uxion".to_string(),
            amount: item.price,
        }],
    };

    Ok(Response::new()
        .add_message(CosmosMsg::Bank(refund))
        .add_attribute("method", "refund_buyer")
        .add_attribute("refunded_to", buyer))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetItem {} => {
            let item: Item = bincode::deserialize(&deps.storage.get(ITEM_KEY).ok_or_else(|| {
                            StdError::generic_err("Item not found")
                        })?).map_err(|e| StdError::generic_err(format!("Deserialization error: {}", e)))?;
            to_binary(&ItemResponse {
                seller: item.seller,
                price: item.price,
                description: item.description,
                sold: item.sold,
                buyer: item.buyer,
                delivered: item.delivered,
            })
        }
    }
}