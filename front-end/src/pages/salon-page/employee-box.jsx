import "../../css/employee-box.css"

const EmployeeBox = ({ employee }) => {
    return (
        <>
            <div className="employee-box">
                <div className="employee-image-frame">
                    <img src="./profile_sample_image.jpg" alt="Profile" className="employee-image" />
                </div>
                
                <h4>{employee.name}</h4>
                {
                    employee.role === "Owner"
                    ?
                    <h6><i>Owner</i></h6>
                    :
                    <h6>Role: {employee.role}</h6>
                }
                
            </div>
        </>
    )
}

export default EmployeeBox;