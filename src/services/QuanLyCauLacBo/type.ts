// Types cho module Quản lý Câu lạc bộ

export interface ICauLacBo {
	id: string;
	anhDaiDien: string;
	tenCLB: string;
	ngayThanhLap: string;
	moTa: string; // HTML content
	chuNhiemCLB: string;
	hoatDong: boolean;
	ngayTao: string;
}

export interface IDonDangKy {
	id: string;
	hoTen: string;
	email: string;
	soDienThoai: string;
	gioiTinh: 'Nam' | 'Nữ' | 'Khác';
	diaChi: string;
	soTruong: string;
	cauLacBoId: string;
	lyDoDangKy: string;
	trangThai: 'Pending' | 'Approved' | 'Rejected';
	ghiChu?: string; // Lý do từ chối
	ngayTao: string;
	lichSuThaoTac: ILichSuThaoTac[];
}

export interface ILichSuThaoTac {
	nguoiThaoTac: string;
	hanhDong: 'Approved' | 'Rejected' | 'Created' | 'Updated';
	thoiGian: string;
	lyDo?: string;
}

export interface IThanhVien extends Omit<IDonDangKy, 'trangThai' | 'ghiChu'> {
	trangThai: 'Approved';
}

export interface IThongKeCLB {
	tongSoCLB: number;
	tongDonPending: number;
	tongDonApproved: number;
	tongDonRejected: number;
	thongKeTheoCLB: {
		cauLacBoId: string;
		tenCLB: string;
		pending: number;
		approved: number;
		rejected: number;
	}[];
}
