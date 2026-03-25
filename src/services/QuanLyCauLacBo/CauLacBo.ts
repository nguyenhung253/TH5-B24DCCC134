import { ICauLacBo } from './types';

export const cauLacBoService = {
	// Validate dữ liệu câu lạc bộ
	validateCauLacBo: (data: Partial<ICauLacBo>): string[] => {
		const errors: string[] = [];

		if (!data.tenCLB || data.tenCLB.trim().length === 0) {
			errors.push('Tên câu lạc bộ không được để trống');
		}

		if (!data.ngayThanhLap) {
			errors.push('Ngày thành lập không được để trống');
		}

		if (!data.chuNhiemCLB || data.chuNhiemCLB.trim().length === 0) {
			errors.push('Chủ nhiệm CLB không được để trống');
		}

		return errors;
	},

	// Kiểm tra tên CLB đã tồn tại chưa
	isTenCLBExists: (cauLacBos: ICauLacBo[], tenCLB: string, excludeId?: string): boolean => {
		return cauLacBos.some((clb) => clb.tenCLB.toLowerCase() === tenCLB.toLowerCase() && clb.id !== excludeId);
	},

	// Lọc CLB đang hoạt động
	getActiveCauLacBos: (cauLacBos: ICauLacBo[]): ICauLacBo[] => {
		return cauLacBos.filter((clb) => clb.hoatDong);
	},

	// Sắp xếp theo ngày thành lập
	sortByNgayThanhLap: (cauLacBos: ICauLacBo[], order: 'asc' | 'desc' = 'desc'): ICauLacBo[] => {
		return [...cauLacBos].sort((a, b) => {
			const dateA = new Date(a.ngayThanhLap).getTime();
			const dateB = new Date(b.ngayThanhLap).getTime();
			return order === 'asc' ? dateA - dateB : dateB - dateA;
		});
	},
};
