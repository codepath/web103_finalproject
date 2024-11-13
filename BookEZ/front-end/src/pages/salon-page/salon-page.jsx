import "../../css/salon-page.css";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

import EmployeeBox from "./employee-box";
import { getEmployeesBySalonId, getSalonById } from "../../services/salonAPI";

const SalonPage = () => {
    let { id } = useParams();
    const [salonName, setSalonName] = useState("");
    const [salonAddress, setAddress] = useState("");
    const [salonCity, setCity] = useState("");
    const [salonState, setState] = useState("");
    const [salonZipCode, setZipCode] = useState("");
    const [salonPhoneNumber, setPhoneNumber] = useState("");
    const [salonEmail, setEmail] = useState("");

    const [loadingPage, setLoadingPage] = useState(true);
    const [errorPage, setErrorPage] = useState("");
    const [loadingEmployee, setLoadingEmployee] = useState(true);
    const [errorEmployee, setErrorEmployee] = useState("");

    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        const fetchSalonDetails = async () => {
            setLoadingPage(true);
            try {
                const salon = await getSalonById(id);
                setSalonName(salon.name);
                setAddress(salon.address);
                setCity(salon.city);
                setState(salon.state);
                setZipCode(salon.zip_code);
                setPhoneNumber(salon.phone_number);
                setEmail(salon.email);
            } catch (err) {
                setErrorPage("Failed to fetch this salon's details");
            } finally {
                setLoadingPage(false);
            }
        };

        fetchSalonDetails();
    }, [id]);

    useEffect(() => {
        const getAllEmployees = async () => {
            setLoadingEmployee(true);
            try {
                const employees = await getEmployeesBySalonId(id);
                setEmployeeList(employees);
            } catch (err) {
                setErrorEmployee("Failed to fetch employees for this salon!");
            } finally {
                setLoadingEmployee(false);
            }
        };

        getAllEmployees();
    }, [id]);

    return (
        <> 
            <div className="salon-page-salon-details">
                {loadingPage ? (
                    <h1>Loading salon details...</h1>
                ) : errorPage ? (
                    <h2>{errorPage}</h2>
                ) : (
                    <>
                        <h1>{salonName}</h1>
                        <h3>&#xf041; {salonAddress}, {salonCity}, {salonState} {salonZipCode}</h3>
                        <h3>Phone: {salonPhoneNumber}</h3>
                        <h3>Email: {salonEmail}</h3>
                    </>  
                )}
            </div>

            
            {loadingEmployee ? (
                <h2>Loading employees...</h2>
            ) : errorEmployee ? (
                <h2>{errorEmployee}</h2>
            ) : (
                <>
                    <h1>List of Employees</h1>
                    <h3><i>Book your favorite hairdresser or manicurist here</i></h3>
                    <div className="salon-page-salon-list-of-employees">
                        {employeeList.length > 0 ? (
                            employeeList.map((employee) => (
                                <EmployeeBox key={employee.id} employee={employee} />
                            ))
                        ) : (
                            <h2>No employees available for this salon</h2>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default SalonPage;
