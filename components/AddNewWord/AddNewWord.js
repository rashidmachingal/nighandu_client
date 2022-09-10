import styles from "../../styles/AddNewWord.module.css";
import React, {useEffect, useState } from "react";
import pos from './partOfSpeech.js'
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';
import swal from 'sweetalert';
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import MessageModal from "./MessageModal";
import { useRouter } from 'next/router'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const AddNewWord = () => {

  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("")
  const [partOf, setPartOf] = useState("-")
  const [definition, setDefintion] = useState("")
  const [mainState, setMainState] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existWord, setExistWord] = useState("")
  const router = useRouter()

  useEffect(() => {
    const { notfoundword } = router.query
    if(notfoundword){
      setWord(notfoundword)
    }
  }, [])
  

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleAddClick = (e) => {
    e.preventDefault()
    if(definition==="") return swal("ദയവായി മലയാള വ്യാഖ്യാനം എന്ന കളം പൂരിപ്പിക്കുക!");
    if(word==="") return swal("ഇംഗ്ലീഷ് പദം എന്ന കളം പൂരിപ്പിച്ചതിനു ശേഷം മാത്രം മലയാള വ്യാഖ്യാനം നൽകാനാവു");
    let data = {
      english_word: word,
      part_of_speech:partOf,
      malayalam_definition:definition
    }
    setMainState(prevData => [...prevData, data]);
    setDefintion("")
  }

  const handleRemove = (id) =>{
    const allItems = mainState.filter((i,index)=>{
      return id != index
    })
    setMainState(allItems)
  } 

  const handleSubmit = async (e) =>{
    e.preventDefault()
    if(word==="") return swal("ദയവായി ഇംഗ്ലീഷ് പദം എന്ന കളം പൂരിപ്പിക്കുക!");
    if(mainState.length === 0) return swal("ദയവായി ഒരു മലയാളം അർത്ഥമെങ്കിലും ചേർക്കുക!");
    setWord("")
    setMainState([])
    const res = await axios.post("https://determined-pig-pajamas.cyclic.app/api/add-new-word",mainState)
    console.log(res.data)
    if(res.data.status==="NO"){
      setIsModalOpen(true)
      setExistWord(res.data.eng_word)
    }
    if (res.data.status==="OK"){
      handleClick()
    }
  }


  return (
    <>
    <div className={styles.addContainer}>
        <div className={`${styles.addBox} mainBox`}>
          <div className={styles.addTitle}>
            <h2>പുതിയ ഒരു പദം ചേര്‍ക്കുക</h2>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off" className={styles.addForm}>
            <div className={styles.addFormGroup}>
              <label>ഇംഗ്ലീഷ് പദം</label>
              <input value={word} onChange={(e)=>setWord(e.target.value)} placeholder="English Word" type="text" />
            </div>

            {/* Section ----- Start */}

            <div  className={styles.addSection}>
              <div className={styles.addFormSection}>
                <div className={styles.sectionFormGroup}>
                 <label>രൂപം</label>
                 <select onChange={(e)=>setPartOf(e.target.value)} >
                  {pos.map((i)=>{return  <option value={i.pos} key={i.pos} >{i.pos}</option>})}
                 </select>
                </div>
                  <div className={styles.sectionFormGroup} >
                    <label>മലയാള വ്യാഖ്യാനം</label>
                    <input onChange={(e)=>{setDefintion(e.target.value)}} value={definition} placeholder="Malayalam Meaning" type="text" />
                  </div>

              </div>
            </div>

            {/* Section ----- End */}

            <div className={styles.addNewSection}>
              <button onClick={handleAddClick}>മലയാളം വ്യാഖ്യാനം ചേർക്കുക</button>
            </div>

            <div className={mainState.length ? styles.addPreview : null}>
              {mainState.map((i,id)=>{
             return(
              <React.Fragment key={id} >
               <div className={styles.addPreviewMn}>
                <div>
                 <i>{i.part_of_speech}:</i><span> {i.malayalam_definition}</span>
                </div>
                <div>
                <Tooltip title="Remove" ><DeleteIcon onClick={()=>handleRemove(id)} style={{cursor:"pointer"}} /></Tooltip>
                </div>
              </div>
             </React.Fragment>
            )
           })}
            <div className={styles.addPadding}></div></div>
            <div className={styles.addSubmitBtn}>
              <button>PUBLISH</button>
            </div>
          </form>
        </div>
      </div>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Successfully Added New Meaning
        </Alert>
    </Snackbar>
    {isModalOpen ? 
    <MessageModal 
     isModalOpen={isModalOpen} 
     setIsModalOpen={setIsModalOpen} 
     existWord={existWord} /> :null}
    </>
  )
}

export default AddNewWord