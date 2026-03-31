import { IThanhVienCauLacBo, IFilterThanhVien, IChuyenCauLacBo } from './types';

class ThanhVienService {
	filterThanhVien(thanhViens: IThanhVienCauLacBo[], filter: IFilterThanhVien): IThanhVienCauLacBo[] {
		let filtered = [...thanhViens];

		if (filter.cauLacBoId) {
			filtered = filtered.filter((tv) => tv.cauLacBoId === filter.cauLacBoId);
		}

		if (filter.trangThai) {
			filtered = filtered.filter((tv) => tv.trangThai === filter.trangThai);
		}

		if (filter.keyword?.trim()) {
			const keyword = filter.keyword.toLowerCase();
			filtered = filtered.filter(
				(tv) =>
					tv.hoTen.toLowerCase().includes(keyword) ||
					tv.email.toLowerCase().includes(keyword) ||
					tv.soDienThoai.includes(keyword) ||
					tv.soTruong.toLowerCase().includes(keyword),
			);
		}

		return filtered;
	}

	sortThanhVien(thanhViens: IThanhVienCauLacBo[], sortField: string, sortOrder: 'asc' | 'desc'): IThanhVienCauLacBo[] {
		return [...thanhViens].sort((a, b) => {
			let aValue: any = a[sortField as keyof IThanhVienCauLacBo];
			let bValue: any = b[sortField as keyof IThanhVienCauLacBo];

			if (sortField === 'ngayThamGia') {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
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

	chuyenCauLacBo(thanhViens: IThanhVienCauLacBo[], chuyenData: IChuyenCauLacBo): IThanhVienCauLacBo[] {
		return thanhViens.map((tv) => {
			if (chuyenData.thanhVienIds.includes(tv.id)) {
				return {
					...tv,
					cauLacBoId: chuyenData.cauLacBoMoiId,
				};
			}
			return tv;
		});
	}

	getThanhVienByCauLacBo(thanhViens: IThanhVienCauLacBo[], cauLacBoId: string): IThanhVienCauLacBo[] {
		return thanhViens.filter((tv) => tv.cauLacBoId === cauLacBoId && tv.trangThai === 'Active');
	}

	exportThanhVienToExcel(thanhViens: IThanhVienCauLacBo[], tenCauLacBo: string) {
		// Sẽ implement với thư viện xlsx
		const data = thanhViens.map((tv, index) => ({
			STT: index + 1,
			'Họ tên': tv.hoTen,
			Email: tv.email,
			'Số điện thoại': tv.soDienThoai,
			'Giới tính': tv.gioiTinh,
			'Địa chỉ': tv.diaChi,
			'Sở trường': tv.soTruong,
			'Ngày tham gia': new Date(tv.ngayThamGia).toLocaleDateString('vi-VN'),
			'Trạng thái': tv.trangThai === 'Active' ? 'Hoạt động' : 'Không hoạt động',
		}));

		return {
			data,
			fileName: `Danh_sach_thanh_vien_${tenCauLacBo.replace(/\s+/g, '_')}_${
				new Date().toISOString().split('T')[0]
			}.xlsx`,
		};
	}
}

export const thanhVienService = new ThanhVienService();
