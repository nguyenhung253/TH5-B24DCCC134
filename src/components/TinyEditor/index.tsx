import { Input } from 'antd';

interface TinyEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
}

export default function TinyEditor({ value, onChange, placeholder }: TinyEditorProps) {
	return (
		<Input.TextArea
			value={value}
			onChange={(e) => onChange?.(e.target.value)}
			placeholder={placeholder}
			rows={6}
			style={{ minHeight: 150 }}
		/>
	);
}