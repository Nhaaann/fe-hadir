import { BaseResponseSucess } from "@/lib/axiosClient";

interface DataJadwalHariIniInterface {
  jamDetailId: number;
  mapel: string;
  jam_mulai: string;
  jam_selesai: string;
  kelas: string;
  is_absen: boolean;
  is_masuk_kelas: boolean;
  is_mulai: boolean;
}

export interface AbsenKeluarPayload {
  materi: string | undefined;
  kendala?: string | undefined;
}

interface DetailAbsenKelasInterface
  extends Pick<
    DataJadwalHariIniInterface,
    "is_absen" | "jam_mulai" | "jam_selesai"
  > {
  kode_kelas: string;
  nama_kelas: string;
  nama_mapel: string;
  jumlah_siswa: number; // Total siswa
  jumlah_hadir: number; // Jumlah siswa yang hadir
  jumlah_telat: number; // Jumlah siswa yang telat
  jumlah_alpha: number;
  daftar_siswa: daftarSiswaInterface[];
}

interface daftarSiswaInterface {
  id: number;
  nama: string;
  status: string;
  waktu_masuk: string;
  waktu_keluar: string | null;
}

interface Recap {
  Senin: number;
  Selasa: number;
  Rabu: number;
  Kamis: number;
  Jumat: number;
  Sabtu: number;
}

export interface DetailAbsenKelasIResponse extends BaseResponseSucess {
  data: DetailAbsenKelasInterface;
}

export interface DataJadwalHariIniResponse {
  data: DataJadwalHariIniInterface;
}

export interface CreateAbsenGuruPayload {
  jam_detail: number | undefined;
}
export interface CreateAbsenStaffPayload {
  jam_detail: number | undefined;
}

export interface CreateAbsenSiswaPayload {
  kode_class: string | undefined;
}

export interface CreateKelasMasukGuruPayload {
  jam_detail: number | undefined;
}

export interface RecapPayload {
  data: Recap;
}