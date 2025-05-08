function ApplicationLayout({ authenticated, notauthenticated }) {

    const user = null 

  return (
    <> 
        {
            user === null 
            ? notauthenticated
            : authenticated
        }
    </>
        //Använder inte parallella routes på detta sätt
    // <>
    // <div className="border w-full h-64">
    //     { children }
    // </div>
    // <div className="border w-full h-64">
    //     { authenticated }     
    // </div>
    // <div className="border w-full h-64">
    //     { notauthenticated }
    // </div>
    // </>
  )
}

export default ApplicationLayout