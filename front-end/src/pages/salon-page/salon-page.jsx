import "../../css/salon-page.css";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

import salons from "../../data/salons";
import employees from "../../data/employees-mock-data"
import EmployeeBox from "./employee-box";

const SalonPage = () => {
    let { id } = useParams();
    // const [salon, setSalon] = useState();
    const [salonName, setSalonName] = useState("");
    const [salonAddress, setAddress] = useState("");
    const [salonCity, setCity] = useState("");
    const [salonState, setState] = useState("");
    const [salonZipCode, setZipCode] = useState("");
    const [salonPhoneNumber, setPhoneNumber] = useState("");
    const [salonEmail, setEmail] = useState("");

    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        // We will replace endpoint to get salon details here
        const getSalonDetail = () => {
            const salonToFind = salons.filter((salon) => salon.id === Number(id));
            setSalonName(salonToFind[0].name);
            setAddress(salonToFind[0].address);
            setCity(salonToFind[0].city);
            setState(salonToFind[0].state);
            setZipCode(salonToFind[0].zip_code);
            setPhoneNumber(salonToFind[0].phone_number);
            setEmail(salonToFind[0].email);
        }

        const getAllEmployees = () => {
            const employeesOfSalon = employees.filter((em) => em.salon_id === Number(id));
            setEmployeeList(employeesOfSalon);
        }

        getSalonDetail();
        getAllEmployees();
        
    }, [id]);

    return (
        <> 
            <div className="salon-page-salon-details">
                <h1>{salonName}</h1>
                <h3>&#xf041; {salonAddress}, {salonCity}, {salonState} {salonZipCode}</h3>
                <h3>Phone name: {salonPhoneNumber}</h3>
                <h3>Email: {salonEmail}</h3>
            </div>

            <div className="salon-page-salon-list-of-employees">
                {employeeList.map((employee) => (
                    <EmployeeBox employee={employee} />
                ))}
            </div>
        </>
    )

}

export default SalonPage;