import { notFound } from 'next/navigation'
 
export default function ProductPage({params}) {
    if(!params.id){
        notFound()
    }

    let content;

    switch(params.id){
        case '1':
            content=(
                <>
                    <h1>Sport 1 : BADMINTON</h1>
                    <p>Badminton is agood game that anyone can ealisy play through</p>
                </>
            );break;
        case '2':
            content=(
                <>
                    <h1>Sport 2: Cricket</h1>
                    <p>Cricket is game which is celeberated by our whole India</p>
                </>
            );break;
        case '3':
            content=(
                <>
                    <h1>Sport 3: FootBall</h1>
                    <p>FootBall is world wide famous game and have a great fanbase</p>
                </>
            );break;
        default:
            content = (
                <div>
                    <h1>Error - Not Found</h1>
                    <p>Product ID: {params.id}</p>
                  </div>
            );
    }

    return(
        <>{content}</>
    )
    
}