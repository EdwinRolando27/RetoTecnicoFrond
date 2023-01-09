import gql from "graphql-tag"
import {isToken} from "./scripts";

const getRuc = (client, dni, recursos) => {
  return client.query({
    query: gql`query getDniSimple($dni: String!){
                dniSimple(dni: $dni) {
                    ${recursos}
                }
            }`,
    context: {headers: {isAuth: isToken()}},
    variables: {
      dni: dni.toString().trim()
    },
    fetchPolicy: 'no-cache'
  })
}

export default getRuc