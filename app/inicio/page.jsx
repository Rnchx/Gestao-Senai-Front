'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../components/authContext/user';

import PrivateRoute from '../components/privateRouter/PrivateRouter';
import style from './inicio.module.css';
import SecondHeader from '../components/header2/SecondHeader';
import Footer from '../components/footer/Footer';

export default function Home() {


    return (
        <PrivateRoute>
            <div>
                <SecondHeader />
                <div className={style.page}>
                    <div className={style.overlay}>

                        <a className={style.linkContainer} href="../tipoCursos">
                            <div className={style.container}>
                                <h1 className={style.text}>Registro de alunos</h1>
                                <img className={style.img} src="alunos.png" alt="icone" />
                            </div>
                        </a>

                        <a className={style.linkContainer} href="../armarios">
                            <div className={style.container}>
                                <h1 className={style.text}>AAPM</h1>
                                <img className={style.img} src="AAPM.png" alt="icone" />
                            </div>
                        </a>

                    </div>
                    <div className={style.containerFooter}>
                        <Footer />
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
