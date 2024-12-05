import React, { useEffect, useState, useContext } from "react";
import { AppContext } from './context/AppContext';

const CustomDate = () => {
    const contextValue = useContext(AppContext);
    const [course, setCourse] = useState("");
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [customRange, setCustomRange] = useState(false);
    const [subCourse, setSubCourse] = useState([])

    useEffect(()=>{


            getAllCourse()

    },[])


    const getAllCourse = async()=>{
        const data = await contextValue.getAllCourse()
        console.log("data all course =",data)
    
        setSubCourse(data.subCourse)
      }


    const handlePredefinedDate = (option) => {
        const today = new Date();
        let startDate, endDate;
    
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
            const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
            return `${year}-${month}-${day}`;
        };
    
        switch (option) {
            case "Today":
                startDate = endDate = formatDate(today);
                break;
    
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                startDate = endDate = formatDate(tomorrow);
                break;
    
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                startDate = endDate = formatDate(yesterday);
                break;
    
            case "This Month":
                // First and last day of the current month
                const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDayThisMonth = new Date();
                startDate = formatDate(firstDayThisMonth);
                endDate = formatDate(lastDayThisMonth);
                break;
    
            case "Last Month":
                // First and last day of the previous month
                const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                startDate = formatDate(firstDayLastMonth);
                endDate = formatDate(lastDayLastMonth);
                break;
    
            default:
                startDate = "";
                endDate = "";
        }
    
        console.log("Start date and end date =", startDate, endDate);
        setDateRange({ startDate, endDate });
        setCustomRange(false);
    };
    
    return (
        <div className="course-date-section">
        <select
            className="custom-select my-4"
            onChange={(e) => setCourse(e.target.value)}
        >
            <option disabled selected>--- Select Course ---</option>
            {subCourse.length > 0 &&
                subCourse.map((data, index) => (
                    <option key={index} value={data}>
                        {data}
                    </option>
                ))}
        </select>

        <div className="my-3">
            <select
                className="custom-select"
                onChange={(e) => handlePredefinedDate(e.target.value)}
            >
                <option disabled selected>--- Select Date Option ---</option>
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Range">Custom Range</option>
            </select>
        </div>

        {customRange && (
            <div>
                <label className="mr-2">Start Date:</label>
                <input
                    type="date"
                    onChange={(e) =>
                        setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                />
                <label className="mx-2">End Date:</label>
                <input
                    type="date"
                    onChange={(e) =>
                        setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                />
            </div>
        )}

        <div className="">
            <button
                className="btn btn-primary"
              
            >
                Search
            </button>
        </div>
    </div>
    );
};

export default CustomDate;
