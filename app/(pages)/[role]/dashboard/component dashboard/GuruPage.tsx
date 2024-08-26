import Image from "next/image";
import profile from "/public/images/profile.png";
import logo from "/public/images/logo.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import hadirpak from "/public/images/HadirPak_putih.png";
import Footer from "@/component/Footer";
import DoughnutComponent from "../component/DONUTCHART";
import TableJadwal from "@/component/JadwalTable";
import TeacherTable from "../component/TeacherSchedule";
import useCrudModule from "@/hook/useCRUD";
import {
  CreateAbsenGuruPayload,
  DataJadwalHariIniResponse,
} from "@/app/lib/(absen)";
import { signOut } from "next-auth/react";
import useAuthModule from "@/app/lib/(auth)/lib";
import NavbarResponsive from "@/component/NavbarResponsive";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Navbar from "@/component/Navbar";

interface Role {
  role: string;
}
const AdminPage: React.FC<Role> = ({ role }) => {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { useProfile } = useAuthModule();
  const { data: dataProfil } = useProfile();
  const [selectedOption, setSelectedOption] = useState("Weekly");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectChange = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Fetch schedule data and calculate countdown
  const { data, isFetching } =
    useCrudModule().useList<DataJadwalHariIniResponse>("/jadwal/hari-ini-guru");
  const { isLoading: isCreating, mutate } =
    useCrudModule().useCreate<CreateAbsenGuruPayload>(
      "/absen/masuk-guru",
      "/jadwal/hari-ini-guru"
    );
  const { isLoading: isCreatingKelas, mutate: mutateMasukKelas } =
    useCrudModule().useCreate<CreateAbsenGuruPayload>(
      "/absen/masuk-kelas-guru",
      "/jadwal/hari-ini-guru"
    );

  useEffect(() => {
    if (data?.data) {
      const { jam_mulai, jam_selesai } = data.data;

      const updateCountdown = () => {
        const now: any = new Date();
        const [startHour, startMinute] = jam_mulai.split(":").map(Number);
        const [endHour, endMinute] = jam_selesai.split(":").map(Number);

        const startTime: any = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          startHour,
          startMinute
        );
        const endTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          endHour,
          endMinute
        );

        // Adjust start time if it has passed
        if (now > startTime && now < endTime) {
          setCountdown({
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
        } else {
          const timeDiffStart = startTime - now;
          const totalSecondsStart = Math.floor(timeDiffStart / 1000);
          const hoursStart = Math.floor(totalSecondsStart / 3600);
          const minutesStart = Math.floor((totalSecondsStart % 3600) / 60);
          const secondsStart = totalSecondsStart % 60;

          setCountdown({
            hours: hoursStart,
            minutes: minutesStart,
            seconds: secondsStart,
          });
        }
      };

      updateCountdown(); // Initial call
      const interval = setInterval(updateCountdown, 1000); // Update countdown every second

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [data]);

  const handleAbsence = () => {
    if (!data?.data.is_absen) {
      setIsLoading(true);
      mutate(
        {
          jam_detail: data?.data.jamDetailId,
        },
        {
          onSuccess: () => {
            setIsLoading(false);
          },
          onError: () => {
            setIsLoading(false);
          },
        }
      );
    }
  };

  const handleMasukKelas = () => {
    mutateMasukKelas(
      {
        jam_detail: data?.data.jamDetailId,
      },
      {
        onSuccess: () => {
          router.push(`/guru/attendance`);
        },
      }
    );
  };

  // Determine if the countdown has reached zero and if we are within the allowed time range
  const isCountdownOver =
    countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0;
  const isWithinAllowedTime =
    !isCountdownOver &&
    (countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0);

  const buttonDisabled =
    isLoading ||
    data?.data.is_absen ||
    (!isWithinAllowedTime && !isCountdownOver);

  const buttonText = data?.data.is_absen
    ? "Anda sudah absen"
    : isCountdownOver
    ? "Take an attendance before, Click me!"
    : "Jadwal Belum Mulai";

  return (
    <section className="w-screen h-screen overflow-x-hidden">
      {/* <div className="w-full px-10 py-5 border-b bg-[#023E8A] flex flex-row justify-between items-center">
        <picture className="">
          <Image src={hadirpak} alt="hadir" />
        </picture>
        <div className="md:flex hidden gap-10">
          <a href="" className="font-quick text-[#FFBC25] text-base">
            Dashboard
          </a>
          <button
            onClick={() => router.push("attendance")}
            className="font-quick text-white text-base"
          >
            Attendance
          </button>
          <a href="" className="font-quick text-white text-base">
            Userdata
          </a>
        </div>
        <div className="dropdown dropdown-end hidden md:block">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="rounded-full">
              <picture>
                <Image src={profile} alt="user" width={80} height={80} />
              </picture>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a
                onClick={async () => {
                  await signOut();
                  router.push("login");
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
        <NavbarResponsive
          judul1="Dashboard"
          judul2="Attendance"
          judul3="Userdata"
          judul4="Notification"
        />
      </div> */}
      <Navbar title1="Dashboard" title2="Attendance" title3="Recap" role="guru" userData="recap"/>

      <div className="w-screen px-8">
        <div className="flex flex-col md:flex-row w-full justify-between my-10 items-center">
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-3">
              <h1 className="font-quick text-2xl md:text-3xl font-medium">
                Hi, {dataProfil?.data.nama}
              </h1>
              <div className="flex flex-row gap-2">
                <picture>
                  <Image src={logo} alt="user" width={35} height={35} />
                </picture>
                <h1 className="font-quick text-lg md:text-3xl">
                  SMK Madinatul Quran | Teacher
                </h1>
              </div>
            </div>
            <picture>
              <Image src={profile} alt="user" className="md:hidden w-12" />
            </picture>
          </div>
          <hr className="w-full border border-[#6C757D] mt-8 md:hidden" />
          {!data?.data.is_absen && (
            <div className="flex flex-row w-full md:w-auto gap-2 items-center mt-12 md:mt-0">
              <span className="countdown text-[50px] md:text-[100px] font-light text-[#495057]">
                <span style={{ "--value": countdown.hours } as any}></span>:
                <span style={{ "--value": countdown.minutes } as any}></span>:
                <span style={{ "--value": countdown.seconds } as any}></span>
              </span>
              <div className="flex flex-col">
                <h1 className="font-quick font-medium text-[19px] md:text-2xl text-[#495057]">
                  left before check-in to {data?.data.mapel} Class
                </h1>
                {/* <h1 className="font-quick font-medium text-[19px] md:text-2xl text-[#495057]">
                  {data?.data.kelas} Class
                </h1> */}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleAbsence}
          disabled={buttonDisabled}
          className={`btn w-full h-[60px] md:mt-10 text-[#212529] md:text-3xl text-[16px] font-quick font-semibold py-3 ${
            data?.data.is_absen || !isCountdownOver
              ? "btn-disabled"
              : "btn-outline"
          }`}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            buttonText
          )}
        </button>
        <hr className="w-full border border-[#6C757D] mt-8" />
        <div className="md:hidden flex flex-col my-8">
          <div className="flex justify-between mb-4">
            <div className=""></div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex font-quick font-semibold m-1 text-lg cursor-pointer"
                >
                  <ChevronDownIcon className="w-5 mr-2" />
                  {selectedOption}
                </div>
                {isOpen && (
                  <ul className="absolute top-full left-0 dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow">
                    {["Weekly", "Monthly", "Semester"].map((option) => (
                      <li key={option}>
                        <a
                          onClick={() => handleSelectChange(option)}
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          {option}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {selectedOption === "Weekly" && (
            <DoughnutComponent
              title="Weekly"
              absen={25}
              attendece={25}
              permission={50}
            />
          )}
          {selectedOption === "Monthly" && (
            <DoughnutComponent
              title="Monthly"
              absen={25}
              attendece={25}
              permission={50}
            />
          )}
          {selectedOption === "Semester" && (
            <DoughnutComponent
              title="Semester Basis"
              absen={25}
              attendece={25}
              permission={50}
            />
          )}
        </div>

        {/* Row of DoughnutComponents for larger screens */}
        <div className="hidden md:flex flex-row my-8 justify-evenly">
          <DoughnutComponent
            title="Weekly"
            absen={25}
            attendece={25}
            permission={50}
          />
          <DoughnutComponent
            title="Monthly"
            absen={25}
            attendece={25}
            permission={50}
          />
          <DoughnutComponent
            title="Semester Basis"
            absen={25}
            attendece={25}
            permission={50}
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <h1 className="font-quick md:text-xl text-[14px] w-[200px] md:w-[708px]">
            This will kindly remind you of your attendance each time you clock
            in, whether it be weekly, monthly, or per semester.
          </h1>
          <button className="btn btn-outline md:px-4 px-2 font-semibold font-quick hover:text-white md:text-lg hover:bg-[#023E8A]">Dowload Recap</button>
        </div>
        <hr className="w-full border border-[#6C757D] mt-6" />
        {/*  */}

        <div className="md:flex hidden w-full justify-between mt-6">
          <div className="">
            <h1 className="font-quick font-semibold text-4xl text-[#212529]">
              Today`s Class
            </h1>

            <h1 className="font-quick font-medium text-lg text-[#495057] w-[708px] mt-2">
              Today`s class is a{" "}
              <span className="font-bold">{data?.data.mapel} class</span> ,
              please enter the class that is already available in the schedule
              or click button beside.
            </h1>
          </div>
          <button
            onClick={handleMasukKelas}
            disabled={data?.data.is_masuk_kelas}
            className="btn btn-outline font-semibold text-[24px] px-16 h-[98px] hover:bg-[#023E8A]"
          >
            Enter class
          </button>
        </div>
        <TableJadwal />
        <TeacherTable />
        <button className="btn btn-outline md:hidden w-full my-6 font-quick font-semibold ">Enter Class</button>
      </div>
      <Footer />
    </section>
  );
};

export default AdminPage;
