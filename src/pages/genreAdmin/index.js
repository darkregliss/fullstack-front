import React, {useState, useEffect} from 'react';
import Titlepage from "../../components/UI/Title/TitlePage";
import styles from "./index.module.scss";
import genreService from '../../services/genre.service';
import Link from 'next/link';
import { useRouter } from "next/router";

const Index = () => {
    const router = useRouter();
    const [genres, setGenres] = useState([]);

    useEffect(()=>{
        genreService.getGenres()
    .then((data) => {
        setGenres(data);
        console.log(data);
    });
    }, [])

    async function handleDelete (genre) {
        console.log("handle delete");
        //console.log(genre._id);
        genreService.deleteGenre(genre)
        .then((data) => {
            console.log("data");
            router.reload("/genreAdmin");
          })
          .catch((err) => {
            console.log(err);
          });
      };
  
    return (
      
        <div className={styles.genre_admin}>
      <Titlepage title="Genre admin" />
      <div className={styles.genre__content}>
          <>
          <div>
            <button className={styles.product_create}>
                {/* <a href="/addGenre">Create</a> */}
                <Link href="/addGenre">Create</Link>
            </button>
          </div>
          <table className={styles.genre_admin_table}>
            <thead>
              <tr>
                <td>Title</td>
                <td>Delete</td>
              </tr>
            </thead>
            <tbody>
            {

                genres.map((genre, index)=>{

                    return (<tr key={index}>
                    <td>{genre.title}</td>
                    <td>
                        <button className={styles.step_button} onClick={()=>handleDelete(genre)}>
                        delete
                        </button>
                    </td>

                </tr>);
                })
                }
            </tbody>
            <tfoot>
            </tfoot>
            </table>
            <br/>
          </>
      </div>
    </div>
    );
}

export default Index;