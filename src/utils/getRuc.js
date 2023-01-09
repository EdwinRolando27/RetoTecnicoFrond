import gql from "graphql-tag"
import {isToken} from "./scripts";

const getRuc = (client, ruc, recursos) => {
  return client.query({
    query: gql`query getRucSunat($ruc: String!){
                getRucSunat(ruc: $ruc) {
                    ${recursos}
                }
            }`,
    context: {headers: {isAuth: isToken()}},
    variables: {
      ruc: ruc.toString().trim()
    },
    fetchPolicy: 'no-cache'
  })
}

export default getRuc