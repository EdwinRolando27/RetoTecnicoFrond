import React, {useEffect, useState} from 'react'
import {CKEditor} from 'ckeditor4-react'

export default function useCKeditor4({initialState}) {
    const [value, setValue] = useState(initialState ? initialState : '')

    const onChange = ({editor}) => {
        setValue(editor.getData())
    }
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.ckeditor.com/4.18.0/full/ckeditor.js"
        script.async = true

        script.crossOrigin = "anonymous"

        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script);
        }

    }, [])

    const editorValue = (
        <CKEditor
            initData={value}
            onChange={onChange}
            config={{
                toolbar: null, toolbarGroups: null, removeButtons: null, removePlugins: null,
            }}
        />
    )

    return [value, editorValue, setValue]
}
