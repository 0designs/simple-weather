import './emergency.css';
const Emergency = (props) => {
    return (
        <a href={props.emergencyLink} target="_blank" rel="noopener noreferrer" className="emergency">
            <span className="emergency-text"> · {props.emergencyText}</span>
        </a> 
    );
};
export default Emergency;