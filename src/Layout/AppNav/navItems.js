export let AdminNav = [
    {
        id: 'NAD000',
        icon: 'pe-7s-users',
        label: 'Usuarios',
        to: '/admin/users',
        category: 'ADMINISTRADOR'
    },
    {
        id: 'NAD001',
        icon: 'pe-7s-users',
        label: 'Médicos',
        to: '/admin/medicos',
        category: 'ADMINISTRADOR'
    },
    {
        id: 'NAD002',
        icon: 'pe-7s-news-paper',
        label: 'Noticias',
        to: '/admin/news',
        category: 'ADMINISTRADOR'
    },
    {
        id: 'NAD003',
        icon: 'pe-7s-way',
        label: 'Recomendaciones',
        category: 'ADMINISTRADOR'
    },
    {
        id: 'NAD003-1',
        parentId: 'NAD003',
        label: 'Categorias',
        to: '/admin/categorias',
        category: 'ADMINISTRADOR'
    },
    {
        id: 'NAD003-3',
        parentId: 'NAD003',
        label: 'Recomendaciones',
        to: '/admin/recomendaciones',
        category: 'ADMINISTRADOR'
    },
    {
        id: 'NAD004',
        icon: 'pe-7s-mail-open-file',
        label: 'Sugerencias',
        to: '/admin/sugerencias',
        category: 'ADMINISTRADOR'
    }
]