import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

export default function PanouStatistici() {
  const [prag, setPrag] = useState('3')
  const [tara, setTara] = useState('')
  const [statistici, setStatistici] = useState(null)
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    async function incarca() {
      try {
        const date = await getStatistici(prag, tara.trim())
        setStatistici(date)
        setEroare(null)
      } catch (err) {
        setEroare(err.message)
      }
    }

    incarca()
  }, [prag, tara])

  return (
    <section className="panou">
      <h2>Statistici</h2>

      <label>
        Cel puțin{' '}
        <input
          type="number"
          min="1"
          value={prag}
          onChange={(e) => setPrag(e.target.value)}
        />{' '}
        zile
      </label>

      <label>
        Țară{' '}
        <input
          className="tara"
          type="text"
          placeholder="toate"
          value={tara}
          onChange={(e) => setTara(e.target.value)}
        />
      </label>

      {eroare && <p className="stare eroare">Statistici indisponibile: {eroare}</p>}

      {!eroare && statistici && (
        <ul>
          <li>Destinații: {statistici.destinatii}</li>
          <li>Total zile: {statistici.zile}</li>
          <li>Media: {statistici.medie} zile</li>
        </ul>
      )}
    </section>
  )
}