use cosmwasm_std::{
    entry_point, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Binary,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct State {
    pub value: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct InstantiateMsg {
    pub initial_value: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Update { new_value: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetValue,
}

// Instantiate the contract
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = State {
        value: msg.initial_value,
    };
    deps.storage.set(b"state", &bincode::serialize(&state)?);
    Ok(Response::new().add_attribute("method", "instantiate"))
}

// Execute contract logic
#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Update { new_value } => {
            let mut state: State = bincode::deserialize(&deps.storage.get(b"state").unwrap())?;
            state.value = new_value;
            deps.storage.set(b"state", &bincode::serialize(&state)?);
            Ok(Response::new().add_attribute("method", "update"))
        }
    }
}

// Query contract state
#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetValue => {
            let state: State = bincode::deserialize(&deps.storage.get(b"state").unwrap())?;
            Ok(Binary::from(state.value.as_bytes()))
        }
    }
}