import { useEffect, useState } from "react";
import employees from "../data/employees-mock-data";
import { useParams } from "react-router-dom";

const AppointmentPage = () => {

    const [employeeName, setEmployeeName] = useState("");
    const [employeeRole, setEmployeeRole] = useState("");

    const {eid , sid} = useParams();
    console.log("employee id" + eid);
    console.log("salon id" + sid)

    useEffect(() => {
        // We will replace endpoint to get employee details here
        const getAEmployees = () => {
            const employeesOfSalon = employees.filter((em) => em.salon_id === Number(sid) && em.id === Number(eid));
            setEmployeeName(employeesOfSalon[0].name);
            setEmployeeRole(employeesOfSalon[0].role);
            console.log(employeesOfSalon);
        }
        getAEmployees();
        
    }, [eid, sid]);



    return (
        <> 
            <div>
                <h1>{employeeName}</h1>
                <h3>{employeeRole}</h3>
            </div>
        </>
    )

}

export default AppointmentPage;