import gql from "graphql-tag"
import {isToken} from "./scripts";

const getTipoCambio = (client, {path, data}, recursos) => {
  return client.query({
    query: gql`query getApirest($path: String!, $data: JSON!) {
      apirest(path: $path, data: $data) {
        ${recursos}
      }
    }`,
    context: {headers: {isAuth: isToken()}},
    variables: {
      path,
      data
    },
    fetchPolicy: 'no-cache'
  })
}

export default getTipoCambio