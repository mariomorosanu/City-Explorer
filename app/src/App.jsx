import { useEffect, useState } from 'react'
import { getDestinatii, postDestinatie, patchVizitat } from './api/destinatii.js'
import { getNevizitate, totalZile, adaugaDestinatie } from './utils/destinatii.js'
import Rezumat from './components/Rezumat.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import Cautare from './components/Cautare.jsx'
import PanouStatistici from './components/PanouStatistici.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import './App.css'

export default function App() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [seTrimite, setSeTrimite] = useState(false)
  const [cautare, setCautare] = useState('')

  useEffect(() => {
    async function incarca() {
      try {
        const date = await getDestinatii()
        setDestinatii(date)
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
  }, [])

  async function handleToggle(id) {
    const curenta = destinatii.find((d) => d.id === id)

    try {
      const salvata = await patchVizitat(id, !curenta.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (error) {
      console.error('Nu am putut salva modificarea:', error.message)
    }
  }

  async function handleAdd(destinatie) {
    setSeTrimite(true)

    try {
      const salvata = await postDestinatie(destinatie)
      setDestinatii((curent) => adaugaDestinatie(curent, salvata))
      return true
    } catch (error) {
      console.error('Nu am putut adăuga destinația:', error.message)
      return false
    } finally {
      setSeTrimite(false)
    }
  }

  const nevizitate = getNevizitate(destinatii)

  const text = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(text) ||
      d.tara.toLowerCase().includes(text),
  )

  return (
    <main>
      <h1>City Explorer</h1>

      {incarcare && <p className="stare">Se încarcă destinațiile...</p>}

      {eroare && (
        <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>
      )}

      {!incarcare && !eroare && (
        <>
          <Rezumat
            total={destinatii.length}
            nevizitate={nevizitate.length}
            zile={totalZile(nevizitate)}
          />
          <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
          <Cautare valoare={cautare} onChange={setCautare} />
          <PanouStatistici />

          {destinatii.length === 0 && (
            <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
          )}

          {destinatii.length > 0 && afisate.length === 0 && (
            <p className="gol">Niciun rezultat pentru „{cautare.trim()}".</p>
          )}

          {afisate.length > 0 && (
            <ListaDestinatii destinatii={afisate} onToggle={handleToggle} />
          )}
        </>
      )}
    </main>
  )
}