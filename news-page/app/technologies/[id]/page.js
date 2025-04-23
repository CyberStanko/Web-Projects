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
                    <h1>Technology 1 : SpringBoot</h1>
                    <p>SpringBoot is a framework that is used by JAVA</p>
                </>
            );break;
        case '2':
            content=(
                <>
                    <h1>Technology 2: Django</h1>
                    <p>Django is a framework that is used by Python</p>
                </>
            );break;
        case '3':
            content=(
                <>
                    <h1>Technology 3: Wordpress</h1>
                    <p>Wordpress is framework which uses No Code Platform </p>
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