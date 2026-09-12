from app.kafka.producer import send_temperature

def emit_processed_event(event_data: dict) -> bool:
    return send_temperature(event_data)