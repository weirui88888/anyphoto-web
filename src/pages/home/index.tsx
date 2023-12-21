import React, { useRef, useEffect, useState, RefObject } from 'react'
import { Textarea, Tooltip, useKeyboard, KeyCode, Text, Keyboard } from '@geist-ui/core'
import autosize from 'autosize'
import { PenTool, X } from '@geist-ui/icons'
import ButtonRound from '@/components/ButtonRound'
import './index.css'

const maxInputLength = 3000

const mockGenerate = () => {
  return new Promise((res, rej) => {
    setTimeout(res, 3000)
  })
}

const Home = () => {
  const textareaRef: RefObject<HTMLTextAreaElement | null> = useRef(null)
  const [generate, setGenerate] = useState(false)
  const [value, setValue] = useState<string>('')
  useEffect(() => {
    const textareaDom = textareaRef.current
    textareaDom!.focus()
    autosize(textareaDom!)
    return () => {
      autosize.destroy(textareaDom!)
    }
  }, [])

  const handler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const generateImage = async () => {
    setGenerate(true)
    await mockGenerate()
    setGenerate(false)
  }

  const { bindings } = useKeyboard(
    () => {
      if (!generate && value) {
        generateImage()
      }
    },
    [KeyCode.Enter],
    { disableGlobalEvent: true }
  )
  return (
    <div className="home-page">
      <Textarea
        {...bindings}
        width="100%"
        maxLength={maxInputLength}
        placeholder="type any thing you like..."
        rows={12}
        ref={textareaRef as any}
        className="autosize"
        style={{ maxHeight: 'calc(100vh - 280px)', transition: 'height 0.2s', fontSize: '14px' }}
        value={value}
        onChange={handler}
      ></Textarea>
      {value && (
        <Tooltip
          style={{ position: 'absolute', bottom: '60px', right: '10px' }}
          text={
            <Text my={0} style={{ whiteSpace: 'nowrap' }}>
              clear input...
            </Text>
          }
          placement="left"
          scale={0.5}
        >
          <ButtonRound
            auto
            icon={<X />}
            onClick={() => {
              ;(textareaRef.current as any).style.removeProperty('height')
              setValue('')
            }}
          />
        </Tooltip>
      )}

      <Text
        // onAnimationStart={() => setInShake(true)}
        // onAnimationEnd={() => setInShake(false)}
        my={0}
        style={{ position: 'absolute', bottom: '-30px', left: '4px' }}
        font={0.75}
        className={value.length === maxInputLength ? 'shake' : ''}
      >
        {value.length > maxInputLength ? maxInputLength : value.length}/{maxInputLength}
      </Text>

      {!value ? (
        <Tooltip
          scale={0.5}
          text={
            <Text my={0} style={{ whiteSpace: 'nowrap' }}>
              😊 type something before you click this button...
            </Text>
          }
          style={{ position: 'absolute', bottom: '10px', right: '10px' }}
          placement="left"
        >
          <ButtonRound disabled auto icon={<PenTool />} />
        </Tooltip>
      ) : (
        <Tooltip
          scale={0.5}
          text={
            <Text my={0} style={{ whiteSpace: 'nowrap' }}>
              click this button or press {''}
              <Keyboard scale={0.5}>Enter</Keyboard>
            </Text>
          }
          style={{ position: 'absolute', bottom: '10px', right: '10px' }}
          placement="left"
        >
          <ButtonRound loading={generate} auto icon={<PenTool />} onClick={generateImage} onMouseEnter={() => {}} />
        </Tooltip>
      )}
    </div>
  )
}

export default Home
