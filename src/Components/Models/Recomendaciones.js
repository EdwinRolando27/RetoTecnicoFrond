import gql from 'graphql-tag'

const RecomendacionesModel = {
    create: (client, {orden, descripcion, categoria_id, contenido}, recursos) => client.query({
        query: gql`query createRecomendacion($orden: Float, $descripcion: String, $categoria_id: String, $contenido: String){
                createRecomendacion(orden: $orden, descripcion: $descripcion, categoria_id: $categoria_id, contenido: $contenido){
                    ${recursos}
             }
        }`,
        variables: {
            orden, descripcion, categoria_id, contenido
        }
    }),
    update: (client, {id, update}, recursos) => client.query({
        query: gql`query updateRecomendaciones($id: String, $update: JSON){
                updateRecomendaciones(id: $id, update: $update){
                ${recursos}
                }
            }`, variables: {
            id, update
        }
    }),
    activateDelete: (client, {id, eliminar}) => client.query({
        query: gql`query eliminarActivarRecomendacion($id: String, $eliminar: Boolean){
        eliminarActivarRecomendacion(id: $id, eliminar: $eliminar){
            deleted_at, id
             }
        }`, variables: {
            id, eliminar
        }
    }),
    getAll: (client, recursos) => client.query({
        query: gql`{
              selectRecomendaciones {
                ${recursos}
              }
            }`,
        fetchPolicy: 'no-cache'
    }),
}
export default RecomendacionesModel