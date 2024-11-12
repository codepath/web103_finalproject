import { useNavigate } from "react-router-dom";
import "../../css/employee-box.css"

const EmployeeBox = ({ employee }) => {

    const navigate = useNavigate();

    return (
        <>
            <div className={employee.role === "Owner" ? "employee-box isOwner" : "employee-box"} onClick={() => navigate(`/employee/${employee.id}/salon/${employee.salon_id}/appointment`)}>
                <div className="employee-image-frame">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHEJ-8GyKlZr5ZmEfRMmt5nR4tH_aP-crbgg&s" alt="Profile" className="employee-image" />
                </div>
                
                <h4>{employee.name}</h4>
                {
                    employee.role === "Owner"
                    ?
                    <h6 style={{ color: "red" }}><i>Owner</i></h6>
                    :
                    <h6><i>Role</i>: {employee.role}</h6>
                }
                
            </div>
        </>
    )
}

export default EmployeeBox;