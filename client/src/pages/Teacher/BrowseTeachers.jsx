import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaEraser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import { serverAddress } from '../../settings.js'
import DashboardTitle from '../../components/DashboardTitle.jsx'

const BrowseTeachers = () => {

  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState()

  useEffect(() => {

    const fetchData = async (param) => {

      try {
        const response = await axios.get(`${serverAddress}/${param}`)
        console.log(response)
        return response.data
      } catch (error) {
        console.log(error)
      }
    }
    fetchData("teacher").then(data => {
      console.log(data)
      const groupedData = data.reduce((acc, obj) => {
        const { TeacherName, TeacherID, ClassID } = obj;
        if (!acc[TeacherID]) {
          acc[TeacherID] = {
            TeacherID,
            TeacherName,
            ClassIDs: []
          };
        }
        if (!acc[TeacherID].ClassIDs.includes(ClassID)) {
          acc[TeacherID].ClassIDs.push(ClassID);
        }
        return acc;
      }, {});

      // Sonuçları diziye dönüştürüyoruz
      const result = Object.values(groupedData);

      setTeachers(result)
      console.log(result)
    })
    fetchData("class").then(data => setClasses(data))

  }, [])

  const handleRemoveButton = async (id) => {

    const swalResult = await Swal.fire({
      title: "Do you want to delete teacher?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#F52525"
    })
    if (!swalResult.isConfirmed) return

    axios.delete(`${serverAddress}/teacher/${id}`)
      .then((response) => {
        console.log(response)
        window.location.reload();
      })
      .catch(error => console.error(error));
  }

  return (
    <div className="pb-12">
      <DashboardTitle title="Browse Teachers"/>
      {
        teachers && teachers.length ?
          <>
            <div className="grid grid-cols-4 items-center mb-2 py-1.5 font-semibold bg-[#1D0E50] text-center text-lg">
              <h5>Name</h5>
              <h5 className="col-span-2">Classes</h5>
              <h5 className="text-base font-medium italic">Action</h5>
            </div>
            {
              teachers.map((teacher, index) =>
                <div key={index} className="grid grid-cols-4 justify-items-center items-center my-1.5 py-3 font-semibold bg-[#5726FC] text-center">
                  <span>
                    {teacher.TeacherName}
                  </span>
                  <span className="col-span-2 flex gap-x-1">
                    {
                      teacher.ClassIDs && classes &&
                      teacher.ClassIDs.map(teacherClassId =>
                        <span key={teacherClassId} className="px-1.5 rounded-lg bg-[#20183f]">
                          {classes.find(i => i.ClassID == teacherClassId)?.ClassName}
                        </span>
                      )
                    }
                  </span>
                  <span className="flex gap-x-2">
                    <Link to={`/dashboard/edit-teacher/${teacher.TeacherID}`}><FaEdit className="mx-auto text-2xl" /></Link>
                    <button type="button" onClick={() => handleRemoveButton(teacher.TeacherID)}><FaEraser className="mx-auto text-xl text-red-500" /></button>
                  </span>
                </div>
              )
            }
          </>
          :
          <h2 className="text-center text-lg mt-10">Teachers not found!</h2>
      }
    </div>
  )
}

export default BrowseTeachers