import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import BreadCrumbs from "../../components/BreadCrumbs";
import Button from "../../components/Button";
import { useParams } from "react-router-dom";
import SurveyService from "../../services/SurveyService";
import MultiDropdown from "../../components/MultiDropdown";

const AnketDuzenle = () => {
  const location = useLocation();
  let params = useParams();
  const rowData = location.state;

  const [surveyOid, setsurveyOid] = useState();
  const [surveyTitle, setSurveyTitle] = useState();
  const [survayTag, setSurveyTag] = useState();
  const [courseTopic, setCourseTopic] = useState();
  const navigate = useNavigate();
  if (!rowData === null) {
    setsurveyOid(rowData.surveyOid);
    setSurveyTitle(rowData.surveyTitle);
    setSurveyTag(rowData.surveyTags);
    setCourseTopic(rowData.courseTopic);
  }

  const tagArr = rowData.surveyTags ? rowData.surveyTags.split(", "): [];

  const [options,setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(tagArr);
  useEffect(()=>{
    SurveyService.getAllSurveyTags().then(resp => {
      const multiDropdownTags = resp.map(tag => {
        const modifiedTag = {value:tag.tagStringId,label: tag.tagString};
        console.log(modifiedTag);
        return modifiedTag;
      })
      setOptions(multiDropdownTags)
      setSelectedOptions(multiDropdownTags.filter(tag=>tagArr.includes(tag.label)))
    })
  },[])

  const handleSelectedOptionsChange = (updatedOptions) => {
    setSelectedOptions(updatedOptions);
  };

  

  useEffect(() => {
    if (params.id) {
      SurveyService.surveyGetById(params.id)
        .then((response) => {
          setsurveyOid(response.data.oid);
          setSurveyTitle(response.data.surveyTitle);
          const rendered = response.data.surveyTags.map((tag) => tag.name).join(", ");
          setSurveyTag(rendered);

          setCourseTopic(response.data.courseTopic);
        })
        .catch((error) => {
          alert(params.id + "nolu anket bulunamamıştır");
        });
    }
  }, [params.id]);



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(surveyOid, surveyTitle, survayTag, courseTopic);
    const surveyTagIds = selectedOptions.map(option => option.value);
    const updateSurveyData = {
      surveyOid,
      surveyTitle,
      courseTopic,
      surveyTagIds
    };
    SurveyService.update(updateSurveyData)
      .then(
        navigate("/anketler")
      )
      .catch((error) => {
        console.log(error.response);
        if (error.response && error.response.data && error.response.data.customMessage) {
          console.log("Error:" + error.response.data.customMessage)
        } else {
          console.log("Bir hata oluştu...")
        }
      });
  };

  const header = { header: "Anket Güncelle", to: "/anketler/guncelle" };

  const subtitle = [
    {
      title: "Anasayfa",
      to: "/yonetici-sayfasi",
    },
    {
      title: "Anket İşlemleri",
      to: "/anketler",
    },
    {
      title: "Anket Güncelle",
      to: "/anketler/guncelle",
    },
  ];

  const navigateMain = (e) => {
    navigate("/anketler");
  };

  return (
    <Layout>
      <div className="flex flex-col bg-white h-full">
        <BreadCrumbs header={header} subtitle={subtitle} />
        <form
          onSubmit={handleSubmit}
          className="class1 flex justify-center align-center"
        >
          <div className="class2 bg-[#F1F1F1] flex justify-center align-center m-auto ">
            <div className="class3 bg-[#FEFEFE] m-auto  flex flex-col justify-center gap-14 ">
              <div className="flex flex-col gap-14 justify-center items-center">
                <div className="flex items-center justify-between w-[600px] ">
                  <label className="font-semibold w-[150px] ">Anket No</label>
                  <Input disabled value={surveyOid} full />
                </div>
                <div className="flex items-center   w-[600px] ">
                  <label className="font-semibold w-[150px]">Anket Adı</label>
                  <Input
                    onChange={(e) => setSurveyTitle(e.target.value)}
                    value={surveyTitle}
                    full
                  />
                </div>
                <div className="flex items-center w-[600px]">
                  <label className="font-semibold  w-[150px]">
                    Anket Başlığı
                  </label>
                  <Input
                    onChange={(e) => setCourseTopic(e.target.value)}
                    value={courseTopic}
                    full
                  />
                </div>
                <div className="flex items-center w-[600px] gap-6">
                  <label className="font-semibold w-[100px]">
                    Anket Etiketi
                  </label>
                  <MultiDropdown
                    options={options}
                    selectedOptions={selectedOptions}
                    extraClassName={"w-[480px]"}
                    onChange={handleSelectedOptionsChange} />
                </div>
              </div>
              <div className="flex justify-center gap-7 flex-wrap">
                <Button primary rounded bold>
                  Gönder
                </Button>
                <Button
                  onClick={navigateMain}
                  className=""
                  secondary
                  rounded
                  bold
                >
                  VAZGEÇ
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AnketDuzenle;
