/* eslint-disable */
import React, { useState } from 'react'
import CKEditor from 'react-ckeditor-component'

export default function useCkeditor({ initialState }) {
  const [value, setValue] = useState(initialState ? initialState : '')
  const [invalid, setInvalid] = useState(false)

  const onChange = ({ editor }) => {
    setValue(editor.getData())
  }

  const onBlur = evt => {}

  const afterPaste = evt => {}

  const editorValue = (
    <CKEditor
      content={value}
      events={{
        blur: onBlur,
        afterPaste: afterPaste,
        change: onChange
      }}
    />
  )

  return [value, editorValue, setValue, setInvalid]
}
