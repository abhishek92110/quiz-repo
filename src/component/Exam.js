import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "./context/AppContext";
import Nav from "./Nav";
import swal from 'sweetalert';
import Loading from "./Loading";

const Exam = () => {
  const contextValue = useContext(AppContext);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [examData, setExamData] = useState([]);
  const [subCourse, setSubCourse] = useState([]);
  const [course, setCourse] = useState("all");
  const [date, setDate] = useState();
  const [loadingIndex, setLoadingIndex] = useState(null); // Track loading index for toggling status
  const [customRange, setCustomRange] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });


  useEffect(() => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const day = new Date().getDate().toString().padStart(2, "0");

    const todayDate = `${year}-${month}-${day}`;
    
    let objDate = {
      startDate:formatDate(new Date()),
      endDate:formatDate(new Date())
    }
    setDateRange(objDate)

    getExam("all",objDate);
    getAllCourse();
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
  };
  
  
  const handlePredefinedDate = (option) => {
    const today = new Date();
    let startDate, endDate;
  
    switch (option) {
        case "Today":
          setCustomRange(false)
            startDate = endDate = formatDate(today);
            break;
  
        case "Tomorrow":
          setCustomRange(false)
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            startDate = endDate = formatDate(tomorrow);
            break;
  
        case "Yesterday":
          setCustomRange(false)
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            startDate = endDate = formatDate(yesterday);
            break;
  
        case "This Month":
          setCustomRange(false)
            // First and last day of the current month
            const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayThisMonth = new Date();
            startDate = formatDate(firstDayThisMonth);
            endDate = formatDate(lastDayThisMonth);
            break;
  
        case "Last Month":
          setCustomRange(false)
            // First and last day of the previous month
            const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            startDate = formatDate(firstDayLastMonth);
            endDate = formatDate(lastDayLastMonth);
            break;
  
        case "Range":
              console.log("custom range ")
              setCustomRange(true)
              break;
  
        default:
            startDate = "";
            endDate = "";
    }
  
    console.log("Start date and end date =", startDate, endDate);
    setDateRange({ startDate, endDate });
    // setCustomRange(false);
  };

  const getExam = async (course,dateRange) => {

    setLoadingStatus(true);
    const examDetails = await contextValue.getExam(course,dateRange);

    console.log("exam details =",examDetails.data)
    setExamData(examDetails.data);
    setLoadingStatus(false);

  };

  const getAllCourse = async () => {
    const data = await contextValue.getAllCourse();
    setSubCourse(data.subCourse);
  };

  const toggleStatus = async (index) => {
    setLoadingIndex(index); // Set loading state for the clicked index
    const updatedExam = {
      ...examData[index],
      status: examData[index].status === "Active" ? "Deactive" : "Active",
    };

    try {
      const response = await fetch("https://blockey.in:8000/update-exam-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedExam),
      });

      const responseData = await response.json();

      if (responseData.status) {
        setExamData((prevData) =>
          prevData.map((item, idx) =>
            idx === index ? { ...item, status: updatedExam.status } : item
          )
        );
      } else {
        console.error("Failed to update status:", responseData.message);
      }
    } catch (error) {
      console.error("Error while updating status:", error);
    } finally {
      setLoadingIndex(null); // Reset loading state
    }
  };

  const handleShow = (data) => {
    console.log("View details:", data);
  };

  const handleDelete = async (data) => {

    console.log("date range delete api call start=",dateRange)
    // Show SweetAlert confirmation dialog
    swal({
        title: "Are you sure?",
        text: `Do you want to delete the "${data.category}" exam scheduled for ${data.date}?`,
        icon: "warning",
        buttons: ["Cancel", "Yes, Delete"],
        dangerMode: true,
    }).then(async (willDelete) => {
        if (willDelete) {
            setLoadingStatus(true);
            console.log("delete id =", data._id);

            try {
                let response = await fetch("https://blockey.in:8000/delete-exam", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: data._id,
                    }),
                });

                response = await response.json();

                if (response.status) {
                    swal("Success", "The exam has been deleted successfully.", "success");
                    console.log("date range delete api call =",dateRange)
                    getExam(course,dateRange)
                 
                } else {
                    swal("Error", "Failed to delete the exam. Please try again.", "error");
                    setLoadingStatus(false);
                }
            } catch (error) {
                console.error("Error deleting exam:", error);
                swal("Error", "Something went wrong. Please try again.", "error");
                setLoadingStatus(false);
            }
        }
    });
};

  return (
    <div>
      <Nav />

      {loadingStatus && <Loading/>}

      <div className={`container my-4 ${loadingStatus && "overlay"}`}>
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
                <div className='start-end-section'>
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
                    onClick={() => getExam(course, dateRange)}
                >
                    Search
                </button>
            </div>
        </div>

        <table className="table exam-table">
          <thead>
            <tr>
              <th scope="col">S No.</th>
              <th scope="col">Course</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col">View</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {examData.length > 0 &&
              examData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.category}</td>
                  <td>{data.date}</td>
                  <td
                    className={`pointer text-white ${
                      data.status === "Active"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                    onClick={() => toggleStatus(index)}
                  >
                    {loadingIndex === index ? (
                      <div
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      data.status
                    )}
                  </td>
                  <td
                    className="pointer"
                    onClick={() => handleShow(data)}
                  >
                    <i className="fa-regular fa-eye"></i>
                  </td>
                   <td 
                    className="pointer"
                    onClick={() => handleDelete(data)}
                  >
                    <i class="fa-solid fa-trash"></i>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Exam;
