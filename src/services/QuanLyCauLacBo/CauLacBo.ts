import { ICauLacBo, IFormCauLacBo } from './types';

class CauLacBoService {
	validateCauLacBo(data: IFormCauLacBo): string[] {
		const errors: string[] = [];

		if (!data.tenCauLacBo?.trim()) {
			errors.push('Tên câu lạc bộ không được để trống');
		}

		if (!data.ngayThanhLap) {
			errors.push('Ngày thành lập không được để trống');
		} else {
			const ngayThanhLap = new Date(data.ngayThanhLap);
			const today = new Date();
			if (ngayThanhLap > today) {
				errors.push('Ngày thành lập không được lớn hơn ngày hiện tại');
			}
		}

		if (!data.chuNhiem?.trim()) {
			errors.push('Chủ nhiệm câu lạc bộ không được để trống');
		}

		if (!data.moTa?.trim()) {
			errors.push('Mô tả không được để trống');
		}

		return errors;
	}

	checkDuplicateName(cauLacBos: ICauLacBo[], tenCauLacBo: string, excludeId?: string): boolean {
		return cauLacBos.some((clb) => clb.tenCauLacBo.toLowerCase() === tenCauLacBo.toLowerCase() && clb.id !== excludeId);
	}

	searchCauLacBos(cauLacBos: ICauLacBo[], keyword: string): ICauLacBo[] {
		if (!keyword.trim()) return cauLacBos;

		const searchTerm = keyword.toLowerCase();
		return cauLacBos.filter(
			(clb) =>
				clb.tenCauLacBo.toLowerCase().includes(searchTerm) ||
				clb.chuNhiem.toLowerCase().includes(searchTerm) ||
				clb.moTa.toLowerCase().includes(searchTerm),
		);
	}

	sortCauLacBos(cauLacBos: ICauLacBo[], sortField: string, sortOrder: 'asc' | 'desc'): ICauLacBo[] {
		return [...cauLacBos].sort((a, b) => {
			let aValue: any = a[sortField as keyof ICauLacBo];
			let bValue: any = b[sortField as keyof ICauLacBo];

			if (sortField === 'ngayThanhLap' || sortField === 'ngayTao') {
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

	getActiveCauLacBos(cauLacBos: ICauLacBo[]): ICauLacBo[] {
		return cauLacBos.filter((clb) => clb.hoatDong);
	}
}

export const cauLacBoService = new CauLacBoService();
