import { IDonDangKy, IFormDonDangKy, IFilterDonDangKy, IBulkAction, ILichSuThaoTac } from './types';

class DonDangKyService {
	validateDonDangKy(data: IFormDonDangKy): string[] {
		const errors: string[] = [];

		if (!data.hoTen?.trim()) {
			errors.push('Họ tên không được để trống');
		}

		if (!data.email?.trim()) {
			errors.push('Email không được để trống');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			errors.push('Email không đúng định dạng');
		}

		if (!data.soDienThoai?.trim()) {
			errors.push('Số điện thoại không được để trống');
		} else if (!/^[0-9]{10,11}$/.test(data.soDienThoai.replace(/\s/g, ''))) {
			errors.push('Số điện thoại không đúng định dạng');
		}

		if (!data.gioiTinh) {
			errors.push('Giới tính không được để trống');
		}

		if (!data.diaChi?.trim()) {
			errors.push('Địa chỉ không được để trống');
		}

		if (!data.soTruong?.trim()) {
			errors.push('Sở trường không được để trống');
		}

		if (!data.cauLacBoId) {
			errors.push('Câu lạc bộ không được để trống');
		}

		if (!data.lyDoDangKy?.trim()) {
			errors.push('Lý do đăng ký không được để trống');
		}

		return errors;
	}

	checkDuplicateEmail(donDangKys: IDonDangKy[], email: string, excludeId?: string): boolean {
		return donDangKys.some((don) => don.email.toLowerCase() === email.toLowerCase() && don.id !== excludeId);
	}

	filterDonDangKy(donDangKys: IDonDangKy[], filter: IFilterDonDangKy): IDonDangKy[] {
		let filtered = [...donDangKys];

		if (filter.trangThai) {
			filtered = filtered.filter((don) => don.trangThai === filter.trangThai);
		}

		if (filter.cauLacBoId) {
			filtered = filtered.filter((don) => don.cauLacBoId === filter.cauLacBoId);
		}

		if (filter.tuNgay) {
			const tuNgay = new Date(filter.tuNgay);
			filtered = filtered.filter((don) => new Date(don.ngayDangKy) >= tuNgay);
		}

		if (filter.denNgay) {
			const denNgay = new Date(filter.denNgay);
			filtered = filtered.filter((don) => new Date(don.ngayDangKy) <= denNgay);
		}

		if (filter.keyword?.trim()) {
			const keyword = filter.keyword.toLowerCase();
			filtered = filtered.filter(
				(don) =>
					don.hoTen.toLowerCase().includes(keyword) ||
					don.email.toLowerCase().includes(keyword) ||
					don.soDienThoai.includes(keyword) ||
					don.lyDoDangKy.toLowerCase().includes(keyword),
			);
		}

		return filtered;
	}

	sortDonDangKy(donDangKys: IDonDangKy[], sortField: string, sortOrder: 'asc' | 'desc'): IDonDangKy[] {
		return [...donDangKys].sort((a, b) => {
			let aValue: any = a[sortField as keyof IDonDangKy];
			let bValue: any = b[sortField as keyof IDonDangKy];

			if (sortField === 'ngayDangKy' || sortField === 'ngayXuLy') {
				aValue = new Date(aValue || 0).getTime();
				bValue = new Date(bValue || 0).getTime();
			}

			if (typeof aValue === 'string') {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});
	}

	processBulkAction(
		donDangKys: IDonDangKy[],
		action: IBulkAction,
		nguoiXuLy: string,
	): { updatedDons: IDonDangKy[]; lichSuThaoTacs: ILichSuThaoTac[] } {
		const now = new Date().toISOString();
		const updatedDons: IDonDangKy[] = [];
		const lichSuThaoTacs: ILichSuThaoTac[] = [];

		action.donDangKyIds.forEach((donId) => {
			const don = donDangKys.find((d) => d.id === donId);
			if (don && don.trangThai === 'Pending') {
				const updatedDon: IDonDangKy = {
					...don,
					trangThai: action.action === 'approve' ? 'Approved' : 'Rejected',
					ngayXuLy: now,
					nguoiXuLy,
					ghiChu: action.action === 'reject' ? action.lyDo : undefined,
				};

				updatedDons.push(updatedDon);

				const lichSu: ILichSuThaoTac = {
					id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
					donDangKyId: donId,
					hanhDong: action.action === 'approve' ? 'Approved' : 'Rejected',
					nguoiThucHien: nguoiXuLy,
					thoiGian: now,
					lyDo: action.lyDo,
					ghiChu: action.ghiChu,
				};

				lichSuThaoTacs.push(lichSu);
			}
		});

		return { updatedDons, lichSuThaoTacs };
	}

	createLichSuThaoTac(
		donDangKyId: string,
		hanhDong: 'Approved' | 'Rejected',
		nguoiThucHien: string,
		lyDo?: string,
		ghiChu?: string,
	): ILichSuThaoTac {
		return {
			id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
			donDangKyId,
			hanhDong,
			nguoiThucHien,
			thoiGian: new Date().toISOString(),
			lyDo,
			ghiChu,
		};
	}
}

export const donDangKyService = new DonDangKyService();
