export interface PlacedSenior {
  name: string;
  profile: string;
  batch: string;
  placementType: string;
  linkedin: string;
}

export interface IcePlacementCompany {
  id: string;
  name: string;
  prepId?: string;
  seniors: PlacedSenior[];
}

/** ICE B.Tech placements listed on the NITJ placement portal for batches 2026 and 2027. */
const TECH_EMPLOYER_IDS = new Set([
  'accenture',
  'globallogic',
  'hcltech',
  'optum',
  'sigmoid',
  'tredence',
  'addictive-learning-technologies',
  'amazon',
  'bharti-airtel',
  'cisco',
  'flipkart',
  'future-first',
  'maxop',
  'american-express',
  'blackrock',
  'blogstorm-ai',
  'cognizant',
  'exl',
  'finlight-ventures',
  'gladify-edutech',
  'groww',
  'icici-bank',
  'innovaccer',
  'jade-global',
  'js-mobileon',
  'juspay',
  'mathco',
  'mindseekers-technologies',
  'oracle',
  'samsung-r-and-d',
  'tcs',
  'zs-associates',
  'zscaler',
  'navitasys-india',
]);

export const ICE_PLACEMENT_COMPANIES: IcePlacementCompany[] = [
  {
    "id": "reliance-industries-limited",
    "name": "Reliance Industries Limited",
    "prepId": "reliance-industries",
    "seniors": [
      {
        "name": "Akshita Sharma",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/akshita-sharma-860520257"
      },
      {
        "name": "Anuj Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/anuj-yadav-1005b925b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Arvind Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Ayushi",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ayushi-78a340288"
      },
      {
        "name": "Jasjeet Singh",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/jasjeet-singh-plaha-395717279"
      },
      {
        "name": "Kajal Singh",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/kajalsingh1112"
      },
      {
        "name": "Kanchan Singh",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/kanchan-singh-4b766728b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Madhav Agarwal",
        "profile": "Graduate Engineer Trainees",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/madhav-agarwal480?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Mitt Kumar Sharma",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/mitt-kumar-sharma-157a4a248"
      },
      {
        "name": "Mukul Garg",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Pallavi Kushwaha",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/pallavi-kushwaha-970120253"
      },
      {
        "name": "Prabhjot Singh",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/prabhjot-singh-b88662258?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Rhea Srivastava",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/rhea-p-srivastava"
      },
      {
        "name": "Soham Khanna",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/khanna-soham-985078287/"
      },
      {
        "name": "Abhijeet Kaushik",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/abhijeetk7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Aditi Mahajan",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/mahajanaditi14/"
      },
      {
        "name": "Ashish Kumar",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ashish-kumar-2768602a9/?skipRedirect=true"
      },
      {
        "name": "Ayush Singla",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ayush-singla-nitj?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Bhavesh Singh",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Summer Internship",
        "linkedin": "https://www.linkedin.com/in/bhavesh-singh12?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Gugulothu Yugendhar",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/gugulothu-yugendhar-1b450628a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Gurwinder Singh",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/gurwinder-singh-112214290/"
      },
      {
        "name": "Harsh Singh",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/harsh-singh-ba443a267/"
      },
      {
        "name": "Jigyasa",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Karan Kumar",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/karan-kumar-nitj"
      },
      {
        "name": "Khushi",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/khushi-loona-62a74a2b3/"
      },
      {
        "name": "Kushagra Saxena",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/kushagrasaxena198"
      },
      {
        "name": "Mehakmeen Kaur",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/mehakmeen-kaur/"
      },
      {
        "name": "Narendra Godara",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://linkedin.com/in/narendra-godara-67a70a289"
      },
      {
        "name": "Nitin Kumar",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/nitinkumarsvg"
      },
      {
        "name": "Potu Rithvik Reddy",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/potu-rithvik-reddy-31194b323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Purli Sai Kishore",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/purlisaikishore"
      },
      {
        "name": "Raghav Bhardwaj",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/raghav-bhardwaj71/"
      },
      {
        "name": "Rahul Saini",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/rahulsaini776/"
      },
      {
        "name": "Ramavath Babu",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Sachin Singh Rawat",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/7SachinRawat/"
      },
      {
        "name": "Sadgi Saraswat",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sadgi-saraswat-17637a31a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Sarvesh Chouhan",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sarvesh-singh-chouhan/"
      },
      {
        "name": "Shiva Priya.b.s",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/shiva-priya-b5b25b266/"
      },
      {
        "name": "Siddharth Singh",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/siddharth-singh-1b4462278"
      },
      {
        "name": "Sourav Sharma",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sourav-sharma-nitj-b5581627b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
      },
      {
        "name": "Unnati Prashant Khadatkar",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/unnati-khadatkar-563a3628b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Vedant Kumar",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Summer Internship",
        "linkedin": "http://www.linkedin.com/in/vedant-kumar-0b628b290"
      },
      {
        "name": "Vishwa Khurana",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": ""
      }
    ]
  },
  {
    "id": "hindustan-petroleum-hpcl",
    "name": "Hindustan Petroleum (HPCL)",
    "prepId": "hpcl",
    "seniors": [
      {
        "name": "Anmol Badhan",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/anmolbadhan13/"
      },
      {
        "name": "Jasper Jolly",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/jasper-jolly-954x952xii"
      },
      {
        "name": "Jatin Kumar Mutneja",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/jatin-mutneja-b68245259?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Mamta",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/mjakhar1?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Rhea Srivastava",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/rhea-p-srivastava"
      },
      {
        "name": "Vishavpreet Yadav",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/vishavpreet-yadav?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Aditi Mahajan",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/mahajanaditi14/"
      },
      {
        "name": "Ayush Singla",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ayush-singla-nitj?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Bhavesh Singh",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/bhavesh-singh12?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Dhruv Garg",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/dhruv-garg-718849311?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Divyanshu Raj",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/divyanshu-raj-61026b328/"
      },
      {
        "name": "Harnil Kaur",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Jigyasa",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Khushi",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/khushi-loona-62a74a2b3/"
      },
      {
        "name": "Raghav Bhardwaj",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/raghav-bhardwaj71/"
      },
      {
        "name": "Sadgi Saraswat",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sadgi-saraswat-17637a31a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Unnati Prashant Khadatkar",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/unnati-khadatkar-563a3628b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Vishwa Khurana",
        "profile": "Officer - Engineering",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": ""
      }
    ]
  },
  {
    "id": "accenture",
    "name": "Accenture",
    "seniors": [
      {
        "name": "Akshita Sharma",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/akshita-sharma-860520257"
      },
      {
        "name": "Ankit Prajapati",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/prajapati-ankit/"
      },
      {
        "name": "Bhashkar Kumar",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/bhashkar-kumar-71b419355/"
      },
      {
        "name": "Chaitanya Arora",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ichaitanya/"
      },
      {
        "name": "Pushpendra Kumar Jangid",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/pushpendra-208829323"
      },
      {
        "name": "Rishabh Joshi",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/rishabhjoshi2005/"
      },
      {
        "name": "Shantanu Vijay",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/shantanu-vijay-920274249/"
      },
      {
        "name": "Aaryan Rajput",
        "profile": "Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/aaryan-rajput-988504236/"
      },
      {
        "name": "Aaryan Rajput",
        "profile": "Software Engineering",
        "batch": "2027",
        "placementType": "Summer Internship",
        "linkedin": "https://www.linkedin.com/in/aaryan-rajput-988504236/"
      },
      {
        "name": "Abhay Singh",
        "profile": "Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/abhay10singh/"
      },
      {
        "name": "Ajay Saini",
        "profile": "Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ajayyysainii/"
      },
      {
        "name": "Manya Kapoor",
        "profile": "Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/manyaakapoor/"
      },
      {
        "name": "Satya Prakash Singh",
        "profile": "Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/satya-prakash-singh8"
      },
      {
        "name": "Vedant Kumar",
        "profile": "Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "http://www.linkedin.com/in/vedant-kumar-0b628b290"
      }
    ]
  },
  {
    "id": "sun-pharma",
    "name": "Sun Pharma",
    "seniors": [
      {
        "name": "Alisha",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/alisha-gandhi-960243329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
      },
      {
        "name": "Kiran Kumari",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/kiran-kumari-11b85b251"
      },
      {
        "name": "Muskan Choudhary",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/muskan-choudhary-3a12ab257?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Naveen Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/naveen-kumar-0895b4288?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Rajit Kumar Rawat",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/rajit-rawat-06a390287?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Sachin Kumar Yadav",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sachin-yadav-680600257/"
      },
      {
        "name": "Saurabh Chaurasia",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/saurabh-chaurasia-ba880a245?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Surya Kiran",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/surya-kiran-7a95b4281"
      }
    ]
  },
  {
    "id": "globallogic",
    "name": "GlobalLogic",
    "seniors": [
      {
        "name": "Chaitanya Arora",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ichaitanya/"
      },
      {
        "name": "Chandan Kumar Ram",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/chandan-kumar-314b70361"
      },
      {
        "name": "Chirag Bhuyan",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Harsh Verma",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/harsh-verma-069473324/"
      },
      {
        "name": "Priya Darshini Nagar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/priya-darshini-nagar-"
      }
    ]
  },
  {
    "id": "siemens-energy",
    "name": "Siemens Energy",
    "prepId": "siemens-energy",
    "seniors": [
      {
        "name": "Gunroop Kaur",
        "profile": "Graduate Trainee Engineer (GTE) & Post Graduate Trainee Engineer (PGTE)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/gunroop-kaur-42699625a"
      },
      {
        "name": "Tejas Rastogi",
        "profile": "Graduate Trainee Engineer (GTE) & Post Graduate Trainee Engineer (PGTE)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/tejas-rastogi"
      },
      {
        "name": "Abhishek Yadav",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/abhishek-yadav009"
      },
      {
        "name": "Muskan Kaur",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/muskan-kaur-447337277?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        "name": "Sanchit Chopra",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sanchit-chopra/"
      }
    ]
  },
  {
    "id": "hcltech",
    "name": "HCLTech",
    "seniors": [
      {
        "name": "Muskan Soni",
        "profile": "Senior Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/muskan-soni-7171a62a4/"
      },
      {
        "name": "Pranav",
        "profile": "Senior Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/pranavaroraa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Shubham Ranjan",
        "profile": "Senior Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/shubhamranjan105"
      },
      {
        "name": "Vidit Bansal",
        "profile": "Senior Software Engineer",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/vidit-bansal-0b3a6128b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "optum",
    "name": "Optum",
    "seniors": [
      {
        "name": "Jasmine Bajwa",
        "profile": "TDP Associate",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/jasmine-bajwa-642a42286"
      },
      {
        "name": "Omkar Vishnoi",
        "profile": "TDP Associate",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/omkarvishnoi75/"
      },
      {
        "name": "Shelly Rathi",
        "profile": "Full Stack Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/shelly-rathi-08092a24b/"
      },
      {
        "name": "Vishal Thakur",
        "profile": "TDP Associate",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/vishal-thakur-b66658277?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "sigmoid",
    "name": "Sigmoid",
    "seniors": [
      {
        "name": "Bhashkar Kumar",
        "profile": "DE Trainee role",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/bhashkar-kumar-71b419355/"
      },
      {
        "name": "Divansh Arora",
        "profile": "DE Trainee role",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/divansh-arora-dk30"
      },
      {
        "name": "Soham Khanna",
        "profile": "DE Trainee role",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/khanna-soham-985078287/"
      },
      {
        "name": "Tanishk Singh Chauhan",
        "profile": "DE Trainee role",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/tanishksingh7/"
      }
    ]
  },
  {
    "id": "aditya-birla-group",
    "name": "Aditya Birla Group",
    "seniors": [
      {
        "name": "Himanshu Kondal",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/himanshu-kondal-780752286?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
      },
      {
        "name": "Karan Mittal",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/karan-mittal02/"
      },
      {
        "name": "Nitin Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/nitin-kumar-1a7946255/"
      }
    ]
  },
  {
    "id": "jindal-stainless",
    "name": "Jindal Stainless",
    "prepId": "jindal-stainless",
    "seniors": [
      {
        "name": "Basant Kumar",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/basant-kumar-a12982289/"
      },
      {
        "name": "Chada Yashwanth Reddy",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/yashwanth-reddy-a9a273288"
      },
      {
        "name": "Harsh Singh",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/harsh-singh-ba443a267/"
      }
    ]
  },
  {
    "id": "kuantum-papers",
    "name": "Kuantum Papers",
    "seniors": [
      {
        "name": "Aman Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Anmol",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Paritosh Nagarkoti",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/paritosh-nagarkoti-a50435246/"
      }
    ]
  },
  {
    "id": "tredence",
    "name": "Tredence",
    "seniors": [
      {
        "name": "Gerry Monga",
        "profile": "Analyst-DE",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/gerry-monga-649260311?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Shivam",
        "profile": "Analyst-DE",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/shivam-singh-57a6aa244/"
      },
      {
        "name": "Rishi",
        "profile": "Data Engineer Role",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/rishiy05/"
      }
    ]
  },
  {
    "id": "vedanta",
    "name": "Vedanta",
    "seniors": [
      {
        "name": "Aryan Raj",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/aryan-raj-98b800257"
      },
      {
        "name": "Raushan Kumar Jha",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/raushanjha4754"
      },
      {
        "name": "Saket Shubham",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://linkedin.com/in/saket-shubham-053bb3313"
      }
    ]
  },
  {
    "id": "addictive-learning-technologies",
    "name": "Addictive Learning Technologies",
    "seniors": [
      {
        "name": "Aditya Singh",
        "profile": "Counseling Trainee",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Mamta",
        "profile": "Intern",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/mjakhar1?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      }
    ]
  },
  {
    "id": "amazon",
    "name": "Amazon",
    "seniors": [
      {
        "name": "Sambhav Agarwal",
        "profile": "Software Development",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/agsambhav/"
      },
      {
        "name": "Manya Kapoor",
        "profile": "SDE",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/manyaakapoor/"
      }
    ]
  },
  {
    "id": "bharti-airtel",
    "name": "Bharti Airtel",
    "seniors": [
      {
        "name": "Anshika Tripathi",
        "profile": "YTL _ Trainee",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/anshika-tripathi-a35289271/"
      },
      {
        "name": "Mitt Kumar Sharma",
        "profile": "YTL _ Trainee",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/mitt-kumar-sharma-157a4a248"
      }
    ]
  },
  {
    "id": "cisco",
    "name": "Cisco",
    "seniors": [
      {
        "name": "Shelly Rathi",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/shelly-rathi-08092a24b/"
      },
      {
        "name": "Soumya Katyayni",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/soumya-katyayni-79a5b8260/"
      }
    ]
  },
  {
    "id": "engineers-india-limited-eil",
    "name": "Engineers India Limited (EIL)",
    "prepId": "eil",
    "seniors": [
      {
        "name": "Himanshu Kondal",
        "profile": "GET (MT)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/himanshu-kondal-780752286?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
      },
      {
        "name": "Sachin Kumar Yadav",
        "profile": "GET (MT)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sachin-yadav-680600257/"
      }
    ]
  },
  {
    "id": "flipkart",
    "name": "Flipkart",
    "seniors": [
      {
        "name": "Onkar Singh",
        "profile": "Assistant Manager (NEEV)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/onkar-singh-567090247"
      },
      {
        "name": "Shelly Rathi",
        "profile": "Assistant Manager (NEEV)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/shelly-rathi-08092a24b/"
      }
    ]
  },
  {
    "id": "future-first",
    "name": "Future First",
    "seniors": [
      {
        "name": "Harsh Gahlawat",
        "profile": "Intern - International Markets",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/harshgahlawat/"
      },
      {
        "name": "Sanamdeep Singh Brar",
        "profile": "Intern - International Markets",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sanamdeep-singh-brar-8303a4286"
      }
    ]
  },
  {
    "id": "hpcl-mittal-energy-hmel",
    "name": "HPCL-Mittal Energy (HMEL)",
    "seniors": [
      {
        "name": "Adarsh Kumar Singh",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/adarsh-8bi"
      },
      {
        "name": "Nancy",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      }
    ]
  },
  {
    "id": "inox-air-products",
    "name": "INOX Air Products",
    "seniors": [
      {
        "name": "Abhishek Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/abhishek-kumar-4944b5388"
      },
      {
        "name": "Sushant Sagar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sushant-sagar-2174b4282?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "iol-chemicals-and-pharmaceuticals",
    "name": "IOL Chemicals and Pharmaceuticals",
    "seniors": [
      {
        "name": "Manav Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Satvir Singh",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      }
    ]
  },
  {
    "id": "jindal-steel",
    "name": "Jindal Steel",
    "seniors": [
      {
        "name": "Harjot Singh",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ harjot-singh-ab4883297"
      },
      {
        "name": "Sachin Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/sachinkumar10012004?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "maxop",
    "name": "Maxop",
    "seniors": [
      {
        "name": "Kyna",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/kyna-8b4b66228?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      },
      {
        "name": "Saurabh Chaurasia",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/saurabh-chaurasia-ba880a245?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "navitasys-india",
    "name": "Navitasys India",
    "seniors": [
      {
        "name": "Abhijeet Saini",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/abhijeet-saini-bb626836a"
      },
      {
        "name": "Dipankar Prakash",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/dipankar-prakash-b900a6359"
      }
    ]
  },
  {
    "id": "nayara-energy",
    "name": "Nayara Energy",
    "prepId": "nayara-energy",
    "seniors": [
      {
        "name": "Krishna Negi",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/krishna-negi/"
      },
      {
        "name": "Riya Kumari",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/riya-kumari-71ab85255"
      }
    ]
  },
  {
    "id": "occl",
    "name": "OCCL",
    "seniors": [
      {
        "name": "Paritosh Nagarkoti",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/paritosh-nagarkoti-a50435246/"
      },
      {
        "name": "Pavan Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      }
    ]
  },
  {
    "id": "technip-energies",
    "name": "Technip Energies",
    "prepId": "technip-energies",
    "seniors": [
      {
        "name": "Harnil Kaur",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": ""
      },
      {
        "name": "Harnil Kaur",
        "profile": "Trainee",
        "batch": "2027",
        "placementType": "Summer Internship",
        "linkedin": ""
      }
    ]
  },
  {
    "id": "tetra-pak",
    "name": "Tetra Pak",
    "seniors": [
      {
        "name": "Ayush Kumar",
        "profile": "Automation Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/ayush-kumar-akdest"
      },
      {
        "name": "Gurwinder Singh",
        "profile": "Future Talent Programme (FTP)",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/gurwinder-singh-112214290/"
      }
    ]
  },
  {
    "id": "american-express",
    "name": "American Express",
    "seniors": [
      {
        "name": "Vanshika Soni",
        "profile": "Management Trainee",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/vanshikasoni20?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "bharat-petroleum-bpcl",
    "name": "Bharat Petroleum (BPCL)",
    "prepId": "bpcl",
    "seniors": [
      {
        "name": "Rajit Kumar Rawat",
        "profile": "Engineers",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/rajit-rawat-06a390287?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      }
    ]
  },
  {
    "id": "blackrock",
    "name": "BlackRock",
    "seniors": [
      {
        "name": "Jasmine Bajwa",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/jasmine-bajwa-642a42286"
      }
    ]
  },
  {
    "id": "blogstorm-ai",
    "name": "Blogstorm.ai",
    "seniors": [
      {
        "name": "Arushi Gupta",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      }
    ]
  },
  {
    "id": "cognizant",
    "name": "Cognizant",
    "seniors": [
      {
        "name": "Kallol Khatua",
        "profile": "Ace Frontier Engineer Program",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/kallol-khatua/"
      }
    ]
  },
  {
    "id": "dcm-shriram",
    "name": "DCM Shriram",
    "seniors": [
      {
        "name": "Arpan Saini",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "http://www.linkedin.com/in/arpan-saini-807582287"
      }
    ]
  },
  {
    "id": "exl",
    "name": "EXL",
    "seniors": [
      {
        "name": "Uttamdeep Singh",
        "profile": "Analytics – Business Analyst (Band-A2)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/uttamdeep-singh"
      }
    ]
  },
  {
    "id": "finlight-ventures",
    "name": "Finlight Ventures",
    "seniors": [
      {
        "name": "Kyna",
        "profile": "Content Researcher, Moderator and Editor",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/kyna-8b4b66228?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "gladify-edutech",
    "name": "Gladify Edutech",
    "seniors": [
      {
        "name": "Neeli Sai Prasad",
        "profile": "Business Development Associate.",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/saiprasadneeli?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "groww",
    "name": "Groww",
    "seniors": [
      {
        "name": "Vidit Bansal",
        "profile": "Product Intern",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/vidit-bansal-0b3a6128b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "havells",
    "name": "Havells",
    "seniors": [
      {
        "name": "Anshika Ram Rane",
        "profile": "Graduate Engineer Trainee",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/anshika-ram-rane-76167b256/"
      }
    ]
  },
  {
    "id": "honeywell",
    "name": "Honeywell",
    "prepId": "honeywell",
    "seniors": [
      {
        "name": "Jayant Doulwani",
        "profile": "Process Information & Control",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/jayant-doulwani-440006250?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "icici-bank",
    "name": "ICICI Bank",
    "seniors": [
      {
        "name": "Pranav Kumar Dixit",
        "profile": "Relationship Manager",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/pranav-kumar-dixit-98172028b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "iit-kanpur",
    "name": "IIT Kanpur",
    "seniors": [
      {
        "name": "Chhavi Singh",
        "profile": "Research Internship",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/chhavi-akansha-singh-361962248?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "innovaccer",
    "name": "Innovaccer",
    "seniors": [
      {
        "name": "Muskan Soni",
        "profile": "TPM Role",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/muskan-soni-7171a62a4/"
      }
    ]
  },
  {
    "id": "jade-global",
    "name": "Jade Global",
    "seniors": [
      {
        "name": "Diptanshu Maurya",
        "profile": "Associate Consultant - Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/diptanshu-maurya-99a6b5253/"
      }
    ]
  },
  {
    "id": "js-mobileon",
    "name": "JS Mobileon",
    "seniors": [
      {
        "name": "Uttamdeep Singh",
        "profile": "Data Analyst",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/uttamdeep-singh"
      }
    ]
  },
  {
    "id": "juspay",
    "name": "Juspay",
    "seniors": [
      {
        "name": "Harshita Oberoi",
        "profile": "SDE",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/harshita-oberoi-7a621b282/"
      }
    ]
  },
  {
    "id": "mathco",
    "name": "MathCo",
    "seniors": [
      {
        "name": "Ankit Kumar Singh",
        "profile": "AI-Analyst",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/instinct-specie/"
      }
    ]
  },
  {
    "id": "mindseekers-technologies",
    "name": "Mindseekers Technologies",
    "seniors": [
      {
        "name": "Gursaranjot Singh",
        "profile": "Inside Sales Strategist / Business Development Associate (BDA)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/gursaranjot-singh-28bb3320b/"
      }
    ]
  },
  {
    "id": "nestl-india",
    "name": "Nestlé India",
    "seniors": [
      {
        "name": "Shreyash Tripathi",
        "profile": "GET",
        "batch": "2027",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/shreyash-tripathi-1569a2274/"
      }
    ]
  },
  {
    "id": "oracle",
    "name": "Oracle",
    "seniors": [
      {
        "name": "Gerry Monga",
        "profile": "Associate Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/gerry-monga-649260311?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
    ]
  },
  {
    "id": "samsung-r-and-d",
    "name": "Samsung R&D",
    "seniors": [
      {
        "name": "Samarth Raj",
        "profile": "R&D Internship",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/samarth-raj-179713249"
      }
    ]
  },
  {
    "id": "shree-cement",
    "name": "Shree Cement",
    "seniors": [
      {
        "name": "Pavan Kumar",
        "profile": "GET",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": ""
      }
    ]
  },
  {
    "id": "tcs",
    "name": "TCS",
    "seniors": [
      {
        "name": "Tajinder Singh",
        "profile": "Systems Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/tajindersingh0547"
      }
    ]
  },
  {
    "id": "zs-associates",
    "name": "ZS Associates",
    "seniors": [
      {
        "name": "Anant Upadhyay",
        "profile": "Platform Services Associate (PPS)",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/anant-upadhyay-036416260/"
      }
    ]
  },
  {
    "id": "zscaler",
    "name": "Zscaler",
    "seniors": [
      {
        "name": "Shivangi Srivastava",
        "profile": "Software Engineer",
        "batch": "2026",
        "placementType": "Placement",
        "linkedin": "https://www.linkedin.com/in/25shivangi/"
      }
    ]
  }
];

/** Core plant, process, and energy employers. Software and services firms are left out. */
export const ICE_CORE_PLACEMENTS: IcePlacementCompany[] = ICE_PLACEMENT_COMPANIES.filter(
  (company) => !TECH_EMPLOYER_IDS.has(company.id),
);
