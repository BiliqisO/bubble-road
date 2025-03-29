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

// Test module
#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{
        mock_dependencies, mock_env, mock_info, MockApi, MockQuerier, MockStorage,
    };
    use cosmwasm_std::{coins, from_binary, OwnedDeps};

    fn setup_contract() -> OwnedDeps<MockStorage, MockApi, MockQuerier> {
        let mut deps = mock_dependencies();
        let msg = InstantiateMsg {
            price: Uint128::new(1000),
            description: "Test Item".to_string(),
        };
        let info = mock_info("seller", &[]);
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(res.attributes[0].value, "instantiate");
        deps
    }

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies();
        let msg = InstantiateMsg {
            price: Uint128::new(1000),
            description: "Test Item".to_string(),
        };
        let info = mock_info("seller", &[]);
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetItem {}).unwrap();
        let item: ItemResponse = from_binary(&res).unwrap();
        assert_eq!(item.seller, "seller");
        assert_eq!(item.price, Uint128::new(1000));
        assert_eq!(item.description, "Test Item");
        assert_eq!(item.sold, false);
        assert_eq!(item.buyer, None);
        assert_eq!(item.delivered, false);
    }

    #[test]
    fn test_buy_item_success() {
        let mut deps = setup_contract();
        let info = mock_info("buyer", &coins(1000, "uxion"));
        let msg = ExecuteMsg::BuyItem {};
        let res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        assert_eq!(res.attributes[0].value, "buy_item");
        assert_eq!(res.attributes[1].value, "buyer");

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetItem {}).unwrap();
        let item: ItemResponse = from_binary(&res).unwrap();
        assert_eq!(item.sold, true);
        assert_eq!(item.buyer, Some("buyer".to_string()));
        assert_eq!(item.delivered, false);
    }

    #[test]
    fn test_buy_item_insufficient_funds() {
        let mut deps = setup_contract();
        let info = mock_info("buyer", &coins(500, "uxion"));
        let msg = ExecuteMsg::BuyItem {};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone());
        assert!(res.is_err());
        assert_eq!(
            res.unwrap_err().to_string(),
            "Generic error: Insufficient funds"
        );
    }

    #[test]
    fn test_buy_item_already_sold() {
        let mut deps = setup_contract();
        let info = mock_info("buyer1", &coins(1000, "uxion"));
        let msg = ExecuteMsg::BuyItem {};
        execute(deps.as_mut(), mock_env(), info, msg.clone()).unwrap();

        let info = mock_info("buyer2", &coins(1000, "uxion"));
        let res = execute(deps.as_mut(), mock_env(), info, msg);
        assert!(res.is_err());
        assert_eq!(
            res.unwrap_err().to_string(),
            "Generic error: Item already sold"
        );
    }

    #[test]
    fn test_confirm_delivery_success() {
        let mut deps = setup_contract();
        let info = mock_info("buyer", &coins(1000, "uxion"));
        execute(deps.as_mut(), mock_env(), info, ExecuteMsg::BuyItem {}).unwrap();

        let info = mock_info("seller", &[]);
        let msg = ExecuteMsg::ConfirmDelivery {};
        let res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        assert_eq!(res.attributes[0].value, "confirm_delivery");
        assert_eq!(res.messages.len(), 1);
        if let CosmosMsg::Bank(BankMsg::Send { to_address, amount }) = &res.messages[0].msg {
            assert_eq!(to_address, "seller");
            assert_eq!(amount[0].amount, Uint128::new(1000));
            assert_eq!(amount[0].denom, "uxion");
        }

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetItem {}).unwrap();
        let item: ItemResponse = from_binary(&res).unwrap();
        assert_eq!(item.delivered, true);
    }

    #[test]
    fn test_confirm_delivery_not_seller() {
        let mut deps = setup_contract();
        let info = mock_info("buyer", &coins(1000, "uxion"));
        execute(deps.as_mut(), mock_env(), info, ExecuteMsg::BuyItem {}).unwrap();

        let info = mock_info("not_seller", &[]);
        let msg = ExecuteMsg::ConfirmDelivery {};
        let res = execute(deps.as_mut(), mock_env(), info, msg);
        assert!(res.is_err());
        assert_eq!(
            res.unwrap_err().to_string(),
            "Generic error: Only seller can confirm delivery"
        );
    }

    #[test]
    fn test_refund_buyer_success() {
        let mut deps = setup_contract();
        let info = mock_info("buyer", &coins(1000, "uxion"));
        execute(deps.as_mut(), mock_env(), info, ExecuteMsg::BuyItem {}).unwrap();

        let info = mock_info("seller", &[]);
        let msg = ExecuteMsg::RefundBuyer {};
        let res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        assert_eq!(res.attributes[0].value, "refund_buyer");
        assert_eq!(res.attributes[1].value, "buyer");
        assert_eq!(res.messages.len(), 1);
        if let CosmosMsg::Bank(BankMsg::Send { to_address, amount }) = &res.messages[0].msg {
            assert_eq!(to_address, "buyer");
            assert_eq!(amount[0].amount, Uint128::new(1000));
            assert_eq!(amount[0].denom, "uxion");
        }

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetItem {}).unwrap();
        let item: ItemResponse = from_binary(&res).unwrap();
        assert_eq!(item.sold, false);
        assert_eq!(item.buyer, None);
    }

    #[test]
    fn test_refund_buyer_already_delivered() {
        let mut deps = setup_contract();
        let info = mock_info("buyer", &coins(1000, "uxion"));
        execute(deps.as_mut(), mock_env(), info, ExecuteMsg::BuyItem {}).unwrap();

        let info = mock_info("seller", &[]);
        execute(
            deps.as_mut(),
            mock_env(),
            info.clone(),
            ExecuteMsg::ConfirmDelivery {},
        )
        .unwrap();

        let msg = ExecuteMsg::RefundBuyer {};
        let res = execute(deps.as_mut(), mock_env(), info, msg);
        assert!(res.is_err());
        assert_eq!(
            res.unwrap_err().to_string(),
            "Generic error: Item already delivered"
        );
    }
}