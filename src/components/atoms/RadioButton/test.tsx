import React, { useState } from 'react'

interface Event {
    internalId: string
    message: string
}

class MockServer {
    private mockEvents = [{internalId: '1ax', message: 'Howdy'},
                          {internalId: '2za', message: 'Byebye'}];
    async fetchDedupedEvents(eventIds: string[]): Promise<Event[]> {
        // ...code omitted: generates fake events based on the public ID's
        return this.mockEvents.filter(e => eventIds.some(i => i === e.internalId));
    }
}

interface EventProps {
    events: string[]
}

interface Foo {
    name: "foo"
    data: string
}

interface Bar {
    name: "bar"
    isActive: boolean
    status: string
    latency?: number
}

type MixedModel = Foo | Bar;

const a: MixedModel = {
    name: 'bar',
    status: "dandilion"
}

const b: MixedModel = {
    name: 'foo',
    status: 'dandilion'
}

const c: MixedModel = {
    name: 'bar',
    isActive: true,
    status: 'dandilion'
}

const d: MixedModel = {
    name: 'bar',
    status: 'dandilion',
    latency: 100
}

const Events = (props: EventProps) => {
    var server = new MockServer();
    var eventIds = props.events;
    var events: Event[] = [];

    server.fetchDedupedEvents(eventIds).then((fetchedEvents) => {
        events = fetchedEvents;
        console.log(events); // events are here, it works!
    });

    return (
        <div className="event-container">
            <div>Events</div>
            {events.map((event: Event) => (       // yet nothing shows up?!?!?
                <div className="event">
                    <div className="event-header">
                        <span className="label">Event ID:</span> {event.internalId}
                    </div>
                    <div className="event-body">
                        {event.message}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Events;
