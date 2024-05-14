import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaEraser, FaUser } from 'react-icons/fa'
import { serverAddress } from '../settings'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const BrowseStudents = () => {

  const [students, setStudents] = useState([])

  const [parents, setParents] = useState([])
  const [classes, setClasses] = useState([])

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
    fetchData("student").then(data => setStudents(data))
    fetchData("parent").then(data => setParents(data))
    fetchData("class").then(data => setClasses(data))

  }, [])

  const handleRemoveButton = async (id) => {

    const swalResult = await Swal.fire({
      title: "Do you want to delete it?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#F52525"
    })
    if (!swalResult.isConfirmed) return

    axios.delete(`${serverAddress}/student/${id}`)
      .then((response) => {
        console.log(response)
        window.location.reload();
      })
      .catch(error => console.error(error));
  }

  return (
    <div className="py-8">
      {
        students && students.length ?
          <>
            <div className="grid grid-cols-6 items-center mb-2 py-1 font-semibold bg-[#1D0E50] text-center text-lg">
              <h5>Photo</h5>
              <h5>Number</h5>
              <h5>Name</h5>
              <h5>Parent</h5>
              <h5>Class</h5>
              <h5 className="text-base font-medium italic">Action</h5>
            </div>
            {
              students && students.map((student, index) =>
                <div key={index} className="grid grid-cols-6 justify-items-center items-center my-2 py-2 font-semibold bg-[#5726FC] text-center">
                  <span className="w-12 h-12 overflow-hidden rounded-full flex items-center justify-center">
                    <img src={`${serverAddress}/${student.Photo}`} />
                  </span>
                  <span>
                    {student.Number}
                  </span>
                  <span>
                    {student.Name}
                  </span>
                  <span>
                    {
                      parents && parents.find(i => i.ID == student.ParentID)?.Name
                    }
                  </span>
                  <span>
                    {
                      classes && classes.find(i => i.ID == student.ClassID)?.Name
                    }
                  </span>
                  <span className="flex gap-x-2">
                    <Link to={`/dashboard/edit-student/${student.ID}`}><FaEdit className="mx-auto text-2xl" /></Link>
                    <button type="button" onClick={() => handleRemoveButton(student.ID)}><FaEraser className="mx-auto text-lg text-red-600" /></button>
                  </span>
                </div>
              )
            }
          </>
          :
          <h2 className="text-center text-lg mt-10">Students not found!</h2>
      }
    </div>
  )
}

export default BrowseStudents