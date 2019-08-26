/* Common mutations */
export const FETCH_START = 'setLoading'
export const FETCH_CLIENT_START = 'setClientLoading'
export const FETCH_PROVIDER_START = 'setProviderLoading'
export const SYNCH_CLIENT_START = 'setClientSynching'
export const SYNCH_PROVIDER_START = 'setProviderSynching'
export const SET_ERROR = 'setError'
export const RESET_STATE = 'resetModuleState'

/* Users mutations */
export const PURGE_AUTH = 'logOut'
export const SET_AUTH = 'setUser'

/* Providers mutations */
export const FETCH_PROVIDERS_END = 'setProviders'
export const FETCH_PROVIDERS_SYNC_DIFFERENCES_END = 'syncClientsDifferencesEnd'
export const SYNC_PROVIDERS_END = 'setSyncClients'
export const SET_PROVIDER = 'setProvider'
export const UPDATE_PROVIDER_IN_LIST = 'updateProviderInList'

/* Clients mutations */
export const FETCH_CLIENTS_END = 'setClients'
export const FETCH_CLIENTS_SYNC_DIFFERENCES_END = 'syncProvidersDifferencesEnd'
export const SYNC_CLIENTS_END = 'setSyncClients'
export const SET_CLIENT = 'setClient'
export const UPDATE_CLIENT_IN_LIST = 'updateClientInList'

/* Shippings mutations */
export const FETCH_SHIPPINGS_END = 'setShippings'
export const SET_SHIPPING = 'setShipping'
export const UPDATE_SHIPPING_IN_LIST = 'updateShippingInList'
export const UPDATE_SHIPPING_PRICING = 'updateShippingPricing'

/* Users mutations */
export const FETCH_USERS_END = 'setUsers'
export const SET_USER = 'setUser'
export const UPDATE_USER_IN_LIST = 'updateUserInList'

/* Roles mutations */
export const FETCH_ROLES_END = 'setRoles'

/* Products mutations */
export const FETCH_PRODUCTS_END = 'setProducts'
