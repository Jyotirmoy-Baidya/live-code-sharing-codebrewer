import { SiStreamlabs } from "react-icons/si";
import { useParams } from "react-router-dom"

const LoginHeader = () => {
    const { roomname } = useParams();
    console.log(roomname)
    return (
        <div className='text-white flex py-4 items-center px-8'>
            <div className=''>
                <h1 className='text-2xl font-bold tracking-widest font-helvetica'>CodeCrafters</h1>
            </div>
            <SiStreamlabs className="text-4xl ms-2 mb-2" />
            <div className=" ms-4 text-lg uppercase text-primary">{roomname}</div>

        </div>
    )
}

export default LoginHeader