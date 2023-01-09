export const customSelectStyles = {
    container: (provided, state) => ({
        ...provided,
        padding: 0,
        height: 'fit-content',
        width: '100%'
    }),
    control: (provided, state) => ({
        ...provided,
        borderWidth: 1,
        minHeight: 'fit-content',
        height: 'fit-content'
    }),
    dropdownIndicator: base => ({
        ...base,
        padding: 4
    }),
    clearIndicator: base => ({
        ...base,
        padding: 4
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '25px'
    }),
    valueContainer: base => ({
        ...base,
        padding: '0px 6px'
    }),
    input: (provided, state) => ({
        ...provided,
        height: '25px'
    }),
    menu: (provided, state) => ({
        ...provided,
        // width: "max-content",
        borderBottom: '1px dotted pink',
        // zIndex: '9999'
    })
}

export const styleLink = {
    color: '#FFF',
    textDecoration: 'none',
    '&:focus, &:hover, &:visited, &:link, &:active': {textDecoration: 'none'}
}

export const LOGO_EMPRESA = '4q2jtjazgkngjpj8v.png'
export const CERTIFICADO_EMPRESA = '4q2jtj8scknkjgpcx.pfx'
export const API_FACT = 'https://apifact.dockerecofact.store'
export const SOAP_URL = 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService?wsdl'
export const USER_SOL = 'MODDATOS'
export const PASSWORD_SOL = 'moddatos'
export const PASSWORD_CER = 'smartb'
export const SOAP_ENVIO = '01'
export const SOAP_TIPO = '01'
export const TIPO_DOCUMENTO = '6b5c4b11-a779-11eb-8539-40b0344a6892'
export const ALFABETO = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export const OPERACIONES_COMPRA = [
    {
        value: '29a8f534-d53c-11eb-b8bc-0242ac130003',
        label: "Adquisiciones Gravadas Destinadas a operaciones gravadas y/o de Exportación"
    },
    {
        value: '3f3fab2c-d53c-11eb-b8bc-0242ac130003',
        label: "Adquisiciones Gravadas Destinadas a operaciones gravadas, no gravadas y/o de Exportación"
    },
    {
        value: '41eb1b7c-d53c-11eb-b8bc-0242ac130003',
        label: "Adquisiciones Gravadas Destinadas a operaciones no gravadas"
    },
    {value: '4454417c-d53c-11eb-b8bc-0242ac130003', label: "Adquisiciones no Gravadas"}
]
export const OPERACIONES_VENTA = [
    {value: '5b022402-26f9-11ec-9621-0242ac130002', label: "Gravada", name: "Gravado"},
    {value: '632722d6-26f9-11ec-9621-0242ac130002', label: "Exonerada", name: "Exonerado"},
    {value: '67cba690-26f9-11ec-9621-0242ac130002', label: "Inafecta", name: "Inafecto"},
    {value: '6b7004d0-26f9-11ec-9621-0242ac130002', label: "Exportación", name: "Exportación"}
]
export const AFECTACIONES = [
    {value: '48a1bf3e-d53c-11eb-b8bc-0242ac130003', label: "Detracciones", name: 'DETRACCIÓN'},
    {value: '4ba4219a-d53c-11eb-b8bc-0242ac130003', label: "Retenciones", name: 'RETENCIÓN'},
    {value: '4f3f0324-d53c-11eb-b8bc-0242ac130003', label: "Percepciones", name: 'PERCEPCIÓN'},
    {value: '537d9770-d53c-11eb-b8bc-0242ac130003', label: "Impuesto a la Renta", name: 'IMPUESTO A LA RENTA'}
]
export const PAGINATION = [{value: 5, label: '5 Filas'}, {value: 10, label: '10 Filas'}, {value: 20, label: '20 Filas'},
    {value: 25, label: '25 Filas'}, {value: 50, label: '50 Filas'}, {value: 100, label: '100 Filas'}]
export const BUSQUEDA_MFGCP = [{value: '1', label: 'Mes'}, {value: '2', label: 'Fechas'}, {value: '3', label: 'Glosa'},
    {value: '4', label: 'CUO'}]
export const TIPOS_CUENTA = [{value: '1', label: 'DINERO EN EFECTIVO'}, {value: '2', label: 'ENTIDADES FINANCIERAS'}]
export const MONEDAS = [{value: 'ff6664ae-a779-11eb-85cf-40b0344a6892', label: 'SOLES', code: 'PEN'},
    {value: 'ff668bb4-a779-11eb-85d0-40b0344a6892', label: 'DÓLARES AMERICANOS', code: 'USD'}]
export const PAGO_ACTIVO = ['ea7e35be-220b-11ec-bdf8-13a4a75f3041', 'f4539214-220b-11ec-ae30-f3f6e9fe190d', '0f17e438-220c-11ec-adf5-77be0344e22b', '129965aa-220c-11ec-adf6-5784bddb7a64', 'fd2b32f2-220b-11ec-a62c-57087e024016', '203e6a2a-220c-11ec-9fa0-2bae39dbcd1e', 'fc7a149a-e5e7-11ec-88f5-18c04dc1e3d5']
export const COCINERO = '129965aa-220c-11ec-adf6-5784bddb7a64'
export const COMPROBANTES = [
    {value: "1daedb68-a779-11eb-84b9-40b0344a6892", label: "01 - Factura", code: '01'},
    {value: "1daedb6a-a779-11eb-84bb-40b0344a6892", label: "03 - Boleta de Venta", code: '03'},
    {value: "1daedb6e-a779-11eb-84bf-40b0344a6892", label: "07 - Nota de Crédito", code: '07'},
    {value: "1daedb6f-a779-11eb-84c0-40b0344a6892", label: "08 - Nota de Débito", code: '08'},
    {value: "a6062ae0-15a4-11ec-8fec-77a5f80a0a28", label: "99 - Nota de venta", code: '99'}
]
export const RUBROS = [
    {value: "20eba230-3c01-11ec-9bab-230c8243001c", label: "COMERCIAL"},
    {value: "256172e0-3c01-11ec-9bab-230c8243001c", label: "SERVICIOS"},
    {value: "27ab89f0-3c01-11ec-9bab-230c8243001c", label: "RESTAURANTE"},
    {value: "29fb6d60-3c01-11ec-9bab-230c8243001c", label: "HOTEL"},
    {value: "312317a0-3c01-11ec-9bab-230c8243001c", label: "BAR"},
    {value: "b4540182-4275-11ec-9f69-3f4be2201f55", label: "GRIFO"},
    {value: "fe57642c-3b58-11ed-a261-0242ac120002", label: "CONSULTORIO"}
]
export const ESTADOS141 = [
    {value: '0', label: '0 - Cuando la operación (anotación optativa sin efecto en el IGV) corresponde al periodo'},
    {
        value: '1',
        label: '1 - Cuando la operación (ventas gravadas, exoneradas, inafectas y/o exportaciones) corresponde al periodo, así como a las Notas de Crédito y Débito emitidas en el periodo'
    },
    {
        value: '2',
        label: '2 - Cuando el documento ha sido inutilizado durante el periodo previamente a ser entregado, emitido o durante su emisión'
    }, {
        value: '8',
        label: '8 - Cuando la operación (ventas gravadas, exoneradas, inafectas y/o exportaciones) corresponde a un periodo anterior y NO a sido anotada en dicho periodo'
    }, {
        value: '9',
        label: '9 - Cuando la operación (ventas gravadas, exoneradas, inafectas y/o exportaciones) corresponde a un periodo anterior y SI a sido anotada en dicho periodo'
    }
]
export const ESTADOS81 = [
    {value: '0', label: '0 - Cuando la operación (anotación optativa sin efecto en el IGV) corresponde al periodo'},
    {
        value: '1',
        label: '1 - Cuando se anota el CPago en el periodo que se emitió o que se pagó el impuesto, según corresponda, y da derecho a crédito fiscal'
    },
    {
        value: '6',
        label: '6 - Cuando la fecha de emisión del CPago, es anterior al periodo de anotación y esta dentro de los 12 meses siguiente a la emisión'
    }, {
        value: '7',
        label: '7 - Cuando la fecha de emisión del CPago, es anterior al periodo de anotación y es mayor a 12 meses siguientes a la emisión'
    }, {
        value: '9',
        label: '9 - Cuando se realice un ajuste o rectificación en la anotación de la información de una operación registrada en un periodo anterior'
    }
]
export const ESTADOS82 = [
    {value: '0', label: '0 - Cuando la operación corresponde al periodo.'},
    {
        value: '9',
        label: '9 - Cuando se realice un ajuste o rectificación en la anotación de la información de una operación registrada en un periodo anterior.'
    }
]
export const ESTADOS53 = [
    {value: '1', label: '1 - Cuando la operación corresponde al periodo.'},
    {
        value: '8',
        label: '8 - Cuando la operación corresponde a un periodo anterior y NO ha sido anotada en dicho periodo.'
    },
    {
        value: '9',
        label: '9 - Cuando la operación corresponde a un periodo anterior y SI ha sido anotada en dicho periodo.'
    }
]
export const styleTd = {fontSize: '0.7rem', textAlign: 'center', padding: '0 2px 0 2px'}
export const styleTh = {fontSize: '0.7rem', textAlign: 'center', padding: '0', fontWeight: '700'}