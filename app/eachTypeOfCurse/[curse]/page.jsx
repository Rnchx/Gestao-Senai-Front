'use client';

import style from './curse.module.css';
import SecondHeader from '../../components/header2/SecondHeader';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PrivateRoute from '@/app/components/privateRouter/PrivateRouter';
import Footer from '@/app/components/footer/Footer';

import { GoArrowLeft } from "react-icons/go";

export default function EachCurse() {
  const [students, setStudents] = useState([]);
  const [eachStudent, setEachStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showFilterStudents, setShowFilterStudents] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [uniqueClasses, setUniqueClasses] = useState([]);

  const searchParams = useSearchParams();
  const curso = searchParams.get('curso');
  const router = useRouter();

  const apiUrls = {
    'Técnico': process.env.NEXT_PUBLIC_API_GET_STUDENTS_TECNICO,
    'Itinerário Formativo': process.env.NEXT_PUBLIC_API_GET_STUDENTS_FORMATIVO,
    'Industrial': process.env.NEXT_PUBLIC_API_GET_STUDENTS_INDUSTRIAL,
  };

  const extractUniqueClasses = (studentsData) => {
    const classes = [...new Set(studentsData.map(student => student.studentclass))].filter(Boolean);
    classes.sort();
    setUniqueClasses(classes);
  };

  const fetchStudents = async (url) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const studentsData = response.data.students || response.data;
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      extractUniqueClasses(studentsData);
    } catch (error) {
      console.error(error);
      if (error.message === 'Token não encontrado') {
        setError('Usuário não autenticado');
      } else {
        setError('Erro ao carregar os dados dos estudantes');
      }
    }
  };

  useEffect(() => {
    const apiUrl = apiUrls[curso];
    if (apiUrl) {
      fetchStudents(apiUrl);
    } else {
      setError('Curso inválido');
    }
  }, [curso]);

  const handleShowAllStudents = () => {
    setFilteredStudents(students);
    setShowFilterStudents(false);
    setActiveFilter(null);
  };

  const handleShowAapmContributors = () => {
    const aapmContributors = students.filter(student => student.aapmstatus);
    setFilteredStudents(aapmContributors);
    setShowFilterStudents(true);
    setActiveFilter('aapmContributors');
  };

  const filterByClass = (className) => {
    const filteredByClass = students.filter(
      (student) => student.studentclass === className
    );
    setFilteredStudents(filteredByClass);
    setShowFilterStudents(false);
    setActiveFilter(`class-${className}`);
  };

  const filterByInternshipStatus = (status) => {
    const filteredStudents = students.filter(
      (student) => student.internshipstatus === status
    );
    setFilteredStudents(filteredStudents);
    setShowFilterStudents(false);
    setActiveFilter(`internshipStatus-${status}`);
  };

  const filterByAge = () => {
    const currentYear = new Date().getFullYear();
    const eighteenYearOlds = students.filter((student) => {
      const [day, month, year] = student.dateofbirth.split('/');
      const birthYear = parseInt(year);
      const age = currentYear - birthYear;
      return age >= 18;
    });
    setFilteredStudents(eighteenYearOlds);
    setShowFilterStudents(false);
    setActiveFilter('age18');
  };

  const handleStudentCardClick = (student) => {
    router.push(`/detailingStudent?
      id=${student.id}
      &name=${encodeURIComponent(student.name)}
      &dateofbirth=${encodeURIComponent(student.dateofbirth)}
      &studentclass=${encodeURIComponent(student.studentclass)}
      &coursetype=${encodeURIComponent(student.coursetype)}
      &carometer=${encodeURIComponent(student.carometer)}
      &aapmstatus=${student.aapmstatus}
      &internshipstatus=${student.internshipstatus}
    `);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <PrivateRoute>
      <div>
        <SecondHeader />
        <div className={style.containerFilters}>

          <button onClick={handleGoBack} className={style.buttonBackPage}>
            <p>
              <GoArrowLeft />
            </p>
          </button>

          <h1 className={style.titleCourse}> Alunos - {curso}</h1>

          <button
            className={`${style.buttonsFilter} ${activeFilter === null ? style.activeFilter : ''}`}
            onClick={handleShowAllStudents}>Todos</button>

          <button
            className={`${style.buttonsFilter} ${activeFilter === 'age18' ? style.activeFilter : ''}`}
            onClick={filterByAge}>
            18 anos
          </button>

          <button
            className={`${style.buttonsFilter} ${activeFilter === 'internshipStatus-true' ? style.activeFilter : ''}`}
            onClick={() => filterByInternshipStatus(true)}>
            Disponível para estágio
          </button>

          <button
            className={`${style.buttonsFilter} ${activeFilter === 'aapmContributors' ? style.activeFilter : ''}`}
            onClick={handleShowAapmContributors}
          >
            Contribuintes AAPM
          </button>

          {uniqueClasses.map((className) => (
            <button
              key={className}
              className={`${style.buttonsFilter} ${activeFilter === `class-${className}` ? style.activeFilter : ''}`}
              onClick={() => filterByClass(className)}
            >
              {className}
            </button>
          ))}

        </div>

        <div className={style.containerCards}>
          {error && <p>{error}</p>}
          <div className={style.alunoContainer}>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={style.alunoCard}
                  onClick={() => handleStudentCardClick(student)}
                >
                  <img className={style.imageStudent} src={student.carometer} alt="foto do aluno" />
                  <p className={style.nameStudent}><b>{student.name}</b></p>
                </div>
              ))
            ) : (
              <p>Carregando estudantes...</p>
            )}
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </PrivateRoute>
  );
}