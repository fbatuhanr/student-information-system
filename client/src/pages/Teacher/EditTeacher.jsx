import axios from 'axios'
import React, { useEffect, useState } from 'react'

import HumanImg2 from "../../assets/human-2.png"

import Select from 'react-select'
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../../redux/features/StatusSlice'
import { useNavigate, useParams } from 'react-router-dom'

import { serverAddress } from '../../settings'
import DashboardTitle from '../../components/DashboardTitle.jsx'

const EditTeacher = () => {

  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState([])
  const [teacherClasses, setTeacherClasses] = useState([])

  const [classes, setClasses] = useState([])
  const [classOptions, setClassOptions] = useState()

  useEffect(() => {

    const fetchTeacher = async (param) => {
      try {
        const response = await axios.get(`${serverAddress}/teacher/${id}`)
        console.log(response)
        return response.data[0]
      } catch (error) {
        console.log(error)
      }
    }
    const fetchTeacherClasses = async () => {
      try {
        const response = await axios.get(`${serverAddress}/teacher-classes/${id}`)
        console.log(response.data)
        return response.data.map(i => i.ClassID)
      } catch (error) {
        console.log(error)
      }
    }
    const fetchData = async (param) => {

      try {
        const response = await axios.get(`${serverAddress}/${param}`)
        console.log(response)
        return response.data
      } catch (error) {
        console.log(error)
      }
    }

    fetchTeacher().then(data => setTeacher(data))
    fetchTeacherClasses().then(data => setTeacherClasses(data))
    fetchData("class").then(data => {
      setClasses(data)
      setClassOptions(data.map(i => { return { label: i.ClassName, value: i.ClassID } }))
    })

  }, [])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    console.log(data)
    if (!data) return

    dispatch(setIsLoading(true))

    const resultData = {
      ...data,
      classes: data.classes.map(i => i.value)
    }
    console.log(resultData)

    try {
      const response = await axios.put(`${serverAddress}/teacher/${id}`, resultData);
      console.log(response)

      dispatch(setIsLoading(false))
      navigate("/dashboard/browse-teachers")
    }
    catch (error) {
      console.log(error)
    }

    dispatch(setIsLoading(false))
  }

  return (<>{
    teacher &&
    <form onSubmit={handleSubmit(onSubmit)}>

      <DashboardTitle title="Edit Teacher" />

      <div className="relative">
        <div className="px-12 pb-8 font-outfit">
          <h2 className="text-2xl font-bold">Edit Teacher Informations</h2>
          <div className="py-6">
            <div className="flex justify-center gap-x-2 px-12">
              <div className="basis-1/2">
                <h3 className="text-xl font-semibold ps-2 mb-1">Name</h3>
                <input type="text" placeholder="type here..." defaultValue={teacher.TeacherName} {...register("name", { required: true })}
                  className="w-full bg-[#0D0D0D] text-[#A1A1A1] px-4 py-3 rounded-2xl" />
              </div>
              <div className="basis-1/2">
                <h3 className="text-xl font-semibold ps-2 mb-1">Classes</h3>
                {
                  (classes && classOptions && teacherClasses) &&
                  <Controller
                    control={control}
                    name="classes"
                    defaultValue={teacherClasses.map(i => classOptions.find(j => j.value == i))}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        isMulti
                        name="classes"
                        options={classOptions}
                        onChange={onChange}
                        value={value ? value : []}
                        classNames={{
                          control: () => '!bg-[#0D0D0D] !border-none !rounded-xl !py-1.5',
                          menu: () => '!bg-[#0D0D0D] !border-none',
                          option: () => '!bg-[#29156C] hover:!bg-[#3c209a] !cursor-pointer',
                          multiValue: () => '!bg-[#4F22F2]',
                          multiValueLabel: () => '!bg-[#4F22F2] !text-[#ffffff] !pe-2',
                          multiValueRemove: () => '!bg-[#20183F] !text-[#ffffff]',
                        }}
                      />
                    )}
                  />
                }
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button type="submit" className="min-w-96 bg-[#DBBA12] hover:bg-[#d9bf3b] rounded-2xl py-3 text-xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0d0d0d]">
                Update Teacher
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -right-20">
        <img src={HumanImg2} className="w-56" />
      </div>
    </form>
  }</>)
}

export default EditTeacher