import gql from 'graphql-tag'

const SugerenciasModel = {
    create: (client, {correo, numero, mensaje, asunto, nombre}, recursos) => client.query({
        query: gql`
            query createSugerencias( $correo: String, $numero: String, $mensaje: String, $asunto: String, $nombre: String){
                createSugerencias( correo: $correo, numero: $numero, mensaje: $mensaje, asunto: $asunto, nombre: $nombre){
                    ${recursos}
                }
            }
        `,
        variables: {correo, numero, mensaje, asunto, nombre}
    }),
    updateRead: (client, id, recursos) => client.query({
        query: gql`
            query updateRead($id: String){
                updateRead(id: $id){
                 ${recursos}
               }    
            }
        `,
        variables: {id}
    }),
    selectSugerencias: (client, no_read) => client.query({
        query: gql`query selectNoRead($no_read: Boolean){
             selectNoRead(no_read: $no_read){
                data
             }   
        }`, variables: {no_read}
    }),
    getByID: (client, id) => client.query({
        query: gql`query sugerenciaId($id: String){
             sugerenciaId(id: $id){
                data
            }   
        }`, variables: {id}
    })
}
export default SugerenciasModel