import React, {useEffect} from 'react'
import {Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import 'react-image-crop/dist/ReactCrop.css'
import {useAuth} from "../../../Context";
import {useInput} from "../../../hooks";
import MyLabel from "../../../Components/MyLabel";
import {Categoria} from "../../../Components/Models";

const CrudCategoria = ({config, setConfig, categoria, setCategorias, categorias}) => {
    const {client, toast, removeAllToasts} = useAuth()

    const [codigo, inputCodigo, setCodigo, invalidCodigo, msgCodigo] = useInput({
        typeState: 'text',
        placeholder: 'Código',
    })
    const [nombre, inputNombre, setNombre, invalidNombre, msgNombre] = useInput({
        typeState: 'text',
        placeholder: 'Nombre'
    })

    useEffect(() => {

        const listener = event => {
            if ((event.code === "Enter" || event.code === "NumpadEnter") && config.isOpen)
                saveCategoria()
        }
        document.addEventListener("keydown", listener)
        return () => {
            document.removeEventListener("keydown", listener)
        }
    }, [codigo, nombre])

    useEffect(() => {
        setCodigo(categoria.codigo ? categoria.codigo : "")
        setNombre(categoria.nombre ? categoria.nombre : "")
        msgNombre('Obligatorio')
        msgCodigo('Obligatorio')
    }, [categoria])

    useEffect(() => {
        invalidNombre(nombre === '')
        invalidCodigo(codigo === '')
    }, [codigo, nombre])


    const saveCategoria = () => {
        categoria = {
            ...categoria,
            codigo, nombre
        }
        const crud = categoria.id ? Categoria.update(client, categoria, 'id, codigo, nombre, deleted_at') :
            Categoria.create(client, categoria, 'id, codigo, nombre, deleted_at')
        crud
            .then(response => {
                const newCategoria = response.data[categoria.id ? 'updateCategoria' : 'createCategoria']
                if (newCategoria.id === 'false') {
                    removeAllToasts()
                    toast.error(`Código ya existente`, {autoClose: 4000})
                    return;
                }
                setCategorias(prev => {
                    if (categoria.id)
                        return prev.map(element => element.id !== categoria.id ? element : {
                            ...categoria,
                            codigo,
                            nombre,
                        })
                    else {
                        prev.push({
                            ...categoria,
                            id: newCategoria.id,
                        })
                        return prev.map(p => p)
                    }
                })
                setConfig({
                    ...config,
                    isOpen: false
                })
                removeAllToasts()
                toast.success('¡Categoría guardada Correctamente!', {autoClose: 5000})
            })
            .catch(({message}) => {
                removeAllToasts()
                toast.error(message, {autoClose: 5000})
            })


    }

    return (
        <Modal isOpen={config.isOpen} toggle={() => setConfig({...config, isOpen: false})} backdrop={false}>
            <ModalHeader toggle={() => setConfig({...config, isOpen: false})} style={{border: '0px solid'}}
                         close={<button className="close" onClick={() => setConfig({
                             ...config,
                             isOpen: false
                         })}>&times;</button>}>{categoria.id ? 'Editar' : 'Nueva'} Categoria
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={6} className="pr-0">
                        <MyLabel name="Código" required/>
                        {inputCodigo}
                    </Col>
                    <Col md={6}>
                        <MyLabel name="Nombre"/>
                        {inputNombre}
                    </Col>

                </Row>
            </ModalBody>
            <ModalFooter style={{border: '0px solid'}}>
                <Button color="danger" onClick={() => setConfig({...config, isOpen: false})}>
                    <FontAwesomeIcon icon={faTrash}/> Cancelar
                </Button>
                <Button color="primary" onClick={() => saveCategoria()}>
                    <FontAwesomeIcon icon={faSave}/> Guardar
                </Button>
            </ModalFooter>
        </Modal>
    )
}
export default CrudCategoria