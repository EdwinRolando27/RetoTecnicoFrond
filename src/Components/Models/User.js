import gql from "graphql-tag"

const User = {
    create: (client, {email, nombres, a_paterno, a_materno, avatar, password}, recursos) => client.mutate({
        mutation: gql`mutation createUser(
                    $email: String!, 
                    $nombres: String!, 
                    $a_paterno: String, 
                    $a_materno: String, 
                    $avatar: String, 
                    $password: String!
                 ) {
                  createUser(
                    email: $email, 
                    nombres: $nombres, 
                    a_paterno: $a_paterno, 
                    a_materno: $a_materno, 
                    avatar: $avatar, 
                    password: $password
                    ) {
                    ${recursos}
                  }
                }`,
        variables: {
            email,
            nombres,
            a_paterno,
            a_materno,
            avatar,
            password
        }
    }),
    getAll: (client, recursos) => client.query({
        query: gql`{
              selectUsers {
                ${recursos}
              }
            }`,
        fetchPolicy: "no-cache"
    }),
    caseUser: (client, {id, caso}, recursos) => client.query({
        query: gql`query caseUser($id: String, $caso: String){
                caseUser(id: $id, caso: $caso){
                ${recursos}
             }
        }`
        , variables: {
            id, caso
        }
    }),
    update: (client, {
        id, email, nombres, a_paterno, a_materno, avatar, password
    }, recursos) => client.mutate({
        mutation: gql`mutation updateUser($id: String!, $update: JSON!){
                updateUser(id: $id, update: $update) {
                    ${recursos}
                  }
                }`,
        variables: {
            id: String(id),
            update: {
                email,
                nombres,
                a_paterno,
                a_materno,
                avatar,
                password
            }
        }
    })
}

export default User