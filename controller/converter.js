const latex=require('node-latex')
const stream=require('stream')

const convertl2p=async (latexContent)=>{
    const input = stream.Readable([latexContent])
    try{
        const pdfStream=latex(input) // latex function is taking a json not latex
        // save the pdf in blackblaze cloud storage
        if(pdfStream){
            console.log("pdf to latex sucess")
            // i will write the save function later 
        }else{
            console.log("pdf to latex unsucess")
        }
    }catch(error){
          console.log(error)
    }

}

const handleLatexConversion=async(req , res )=>{
    const {latexContent}=req.body 
    if (!latexContent){
        return res.status(400).send('Latex content invalid')
    }
    try{
        const pdf= await convertl2p(latexContent)

    }catch(err){
        console.error(err.message)
        res.status(500).send(err.message)
    }
}