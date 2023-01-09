import gql from 'graphql-tag'


const CategoriaModel = {
    create: (client, {codigo, nombre}, recursos) => client.mutate({
        mutation: gql`mutation createCategoria(
                        $codigo: String!,
                        $nombre: String!,                       
                    ){
                    createCategoria(
                    codigo: $codigo,
                    nombre: $nombre
                    ){
                    ${recursos}
                    }
                    }`,
        variables: {
            codigo,
            nombre,
        }
    }),
    getAll: (client, recursos) => client.query({
        query: gql`{
              categorias {
                ${recursos}
              }
            }`,
        fetchPolicy: 'no-cache'
    }),
    getNoDeleted: (client, recursos) => client.query({
        query: gql`{
            categoriaNoDeleted{
                ${recursos}
            }
        }`,
        fetchPolicy: 'no-cache'
    }),
    getById: (client, id, recursos) =>
        client.query({
            query: gql`query categoria($id:String!){
        categoria(id: $id){
                   ${recursos}
                }
        }`,
            variables: {
                id
            },
            fetchPolicy: 'no-cache'
        }),
    update: (client, {id, nombre, codigo, local_id}, recursos) => client.mutate({
        mutation: gql`mutation updateCategoria($id: String!, $update: JSON!){
                updateCategoria(id: $id, update: $update){
                ${recursos}
                }
            }`,
        variables: {
            id,
            update: {
                nombre, codigo
            }
        }
    }),
    delete: (client, id, recursos) => client.mutate({
        mutation: gql`mutation deleteCategoria($id: String!){
        deleteCategoria(id: $id){
            ${recursos}
             }
        }`,
        variables: {
            id: id
        }
    }),
    activate: (client, id, recursos) => client.mutate({
        mutation: gql`mutation activateCategoria($id: String!){
        activateCategoria(id: $id){
            ${recursos}
             }
        }`,
        variables: {
            id: id
        }
    }),

}
export default CategoriaModel