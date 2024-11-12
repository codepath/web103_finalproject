import { useNavigate } from "react-router-dom";
import "../../css/employee-box.css"

const EmployeeBox = ({ employee }) => {

    const navigate = useNavigate();

    return (
        <>
            <div className={employee.role === "Owner" ? "employee-box isOwner" : "employee-box"} onClick={() => navigate(`/employee/${employee.id}/salon/${employee.salon_id}/appointment`)}>
                <div className="employee-image-frame">
                    <img src="./profile_sample_image.jpg" alt="Profile" className="employee-image" />
                </div>
                
                <h4>{employee.name}</h4>
                {
                    employee.role === "Owner"
                    ?
                    <h6><i>Owner</i></h6>
                    :
                    <h6><i>Role</i>: {employee.role}</h6>
                }
                
            </div>
        </>
    )
}

export default EmployeeBox;