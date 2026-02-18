// React import not needed with new JSX transform
import Editor from 'react-simple-wysiwyg'

type Props = {
  value: string
  onChange: (e: any) => void
  placeholder?: string
}

function exec(command: string, value?: string) {
  try {
    document.execCommand(command, false, value)
  } catch (e) {
    // ignore
  }
}

export default function WysiwygEditor({ value, onChange, placeholder }: Props) {
  return (
    <Editor value={value} onChange={onChange} placeholder={placeholder}>
      <div className="rsw-toolbar">
        <button type="button" className="rsw-btn" onMouseDown={(e) => { e.preventDefault(); exec('bold') }} title="Bold"><strong>B</strong></button>
        <button type="button" className="rsw-btn" onMouseDown={(e) => { e.preventDefault(); exec('italic') }} title="Italic"><em>I</em></button>
        <button type="button" className="rsw-btn" onMouseDown={(e) => { e.preventDefault(); exec('underline') }} title="Underline"><span style={{textDecoration: 'underline'}}>U</span></button>
      </div>
    </Editor>
  )
}
