import gql from "graphql-tag"

const Auth = {
    verific: (client, {email}) => client.mutate({
        mutation: gql`mutation sendVerific($email: String){
              sendVerific(email: $email) {
                id
              }
            }`,
        variables: {
            email
        }
    }),
    login: (client, {email, password}, recursos) => client.query({
        query: gql`query createToken($email: String!, $password: String!){
              login(email: $email, password: $password) {
                ${recursos}
              }
            }`,
        variables: {
            email,
            password
        },
        fetchPolicy: "no-cache"
    }),
    passwordReset: (client, {email, password, token}, recursos) => client.mutate({
        mutation: gql`mutation resetPassword($email: String!, $password: String!, $token: String!){
                  passwordReset(email: $email password: $password token: $token) {
                    ${recursos}
                  }
                }`,
        variables: {
            email,
            password,
            token
        }
    }),
    reset: (client, {email}, recursos) => client.query({
        query: gql`query resetPassword($email: String!){
                  reset(email: $email) {
                    ${recursos}
                  }
                }`,
        variables: {
            email
        },
        fetchPolicy: "no-cache"
    }),
    emailConfirmation: (client, {token}, recursos) => client.mutate({
        mutation: gql`mutation confirmationEmail($token: String!){
                      emailConfirmation(token: $token) {
                        ${recursos}
                      }
                    }`,
        variables: {
            token
        }
    }),
    verify: (client, {token}, recursos) => client.query({
        query: gql`query resetVerify($token: String!) {
                  verify(token: $token) {
                    ${recursos}
                  }
                }`,
        variables: {
            token
        },
        fetchPolicy: "no-cache"
    }),
    refresh: (client, {refresh}, recursos) => client.query({
        query: gql`query resetVerify($refresh: String!) {
                  refresh(refresh: $refresh) {
                    ${recursos}
                  }
                }`,
        variables: {
            refresh
        },
        fetchPolicy: "no-cache"
    })
}

export default Auth