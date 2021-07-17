module Level0Init exposing (init)

{-| Init of Level1 Model.


# init

@docs init

-}

import Array
import Boundary
import Brick
import Browser.Dom exposing (getViewport)
import EndPoint
import Event
import GlobalBasics
import Level0Type
import MainType
import Needle
import NoticeBoard
import Player
import SavePoint
import Task


{-| `init` of Level1 \`Model
-}
init : () -> ( Level0Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 2000.0, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.init
                        { id = 1, name = "Event1" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 360, 0 ), ( 360.0, 520.0 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 2, name = "Event2" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 200, 440 ), ( 240.0, 440.0 ) )
                                    , ( ( 240, 440 ), ( 240.0, 480.0 ) )
                                    , ( ( 240, 480 ), ( 200.0, 480.0 ) )
                                    , ( ( 200, 480 ), ( 200.0, 440.0 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 3, name = "Event3" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 660, 500 ), ( 660, 540 ) )
                                    , ( ( 660, 540 ), ( 700, 540 ) )
                                    , ( ( 700, 540 ), ( 700, 520 ) )
                                    , ( ( 700, 520 ), ( 660, 500 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 4, name = "Event4" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 120, 440 ), ( 120, 0 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 5, name = "Event5" }
                        (Event.AfterActEvent 6)
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 120, 440 ), ( 120, 0 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 6, name = "Event6" }
                        (Event.AfterActEvent 4)
                        (Event.TimeAfterStart 20)
                        (Event.quickDuration 10)
                    ]
            , boundary = Boundary.normalInit
            , player = Player.init ( 50.0, 490.0 ) Player.defPlayerProperty Player.NoNextPropertyChange
            , bricks =
                Array.fromList
                    (List.concat
                        [ List.map (\i -> Brick.initPos (GlobalBasics.blockPos ( i, 15 ))) (List.range 1 5)
                        , List.map (\i -> Brick.initPos (GlobalBasics.blockPos ( i, 12 ))) (List.range 2 5)
                        , [ Brick.init
                                (GlobalBasics.blockPos ( 18, 14 ))
                                Brick.NormalAppearance
                                (Brick.Visible (Brick.InvisibleAfterEvent 3 Brick.NoNextBrickVisibility))
                                (Brick.NoCollide Brick.NoNextBrickCollision)
                                Brick.NoNextBrickMove
                          ]
                        , [ Brick.initPos (GlobalBasics.blockPos ( 14, 14 ))
                          ]
                        , List.map (\i -> Brick.initPos (GlobalBasics.blockPos ( 19, i ))) (List.range 11 14)
                        , [ Brick.init
                                (GlobalBasics.blockPos ( 6, 12 ))
                                Brick.NormalAppearance
                                (Brick.Invisible (Brick.VisibleAfterEvent 2 Brick.NoNextBrickVisibility))
                                (Brick.Collide Brick.NoNextBrickCollision)
                                Brick.NoNextBrickMove
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPos ( 10, 14 ))
                                Brick.NormalAppearance
                                (Brick.Visible Brick.NoNextBrickVisibility)
                                (Brick.Collide Brick.NoNextBrickCollision)
                                (Brick.Move
                                    (Array.fromList [])
                                    0.0
                                    1
                                    (Brick.Move
                                        (Array.fromList
                                            [ GlobalBasics.blockPos ( 13, 14 )
                                            ]
                                        )
                                        5.0
                                        -1
                                        Brick.NoNextBrickMove
                                    )
                                )
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPos ( 22, 8 ))
                                (Brick.Detailed 100 100 "#000000")
                                (Brick.Visible Brick.NoNextBrickVisibility)
                                (Brick.Collide Brick.NoNextBrickCollision)
                                Brick.NoNextBrickMove
                          ]
                        ]
                    )
            , savePoints =
                Array.fromList [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 )), SavePoint.init (GlobalBasics.blockPos ( 14, 13 )) ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 22, 14 ))
            , noticeBoards =
                Array.fromList
                    [ NoticeBoard.init
                        ( 200.0, 200.0 )
                        (NoticeBoard.Visible "Hello!"
                            (NoticeBoard.VisibleAfterEvent
                                4
                                "Wow, a moving Needle!"
                                (NoticeBoard.VisibleAfterEvent
                                    2
                                    "Wow, a hidden brick!"
                                    (NoticeBoard.VisibleAfterEvent
                                        1
                                        "Wow, a moving brick!"
                                        (NoticeBoard.VisibleAfterEvent
                                            3
                                            "Wow, a fake brick!"
                                            NoticeBoard.NoNextNoticeBoardVisibility
                                        )
                                    )
                                )
                            )
                        )
                        (NoticeBoard.Move
                            (Array.fromList [ ( 400.0, 400.0 ) ])
                            10.0
                            2
                            (NoticeBoard.Move
                                (Array.fromList [ ( 300.0, 300.0 ) ])
                                10.0
                                0
                                NoticeBoard.NoNextNoticeBoardMove
                            )
                        )
                        20
                    ]
            , needles =
                Array.fromList
                    [ Needle.initPos (GlobalBasics.addPosPos ( 0.0, 30.0 ) (GlobalBasics.blockPos ( 4, 14 )))
                    , Needle.init
                        (GlobalBasics.addPosPos ( 0.0, 30.0 ) (GlobalBasics.blockPos ( 4, 11 )))
                        (Needle.NormalNeedle 80.0 Needle.normalNeedleHeight)
                        (Needle.Visible Needle.NoNextNeedleVisibility)
                        (Needle.Collide Needle.NoNextNeedleCollision)
                        (Needle.Move
                            (Array.fromList [])
                            0.0
                            4
                            (Needle.Move
                                (Array.fromList [ ( 120.0, 260.0 ) ])
                                5.0
                                5
                                (Needle.Move
                                    (Array.fromList [ ( 120.0, 430.0 ) ])
                                    10.0
                                    0
                                    Needle.NoNextNeedleMove
                                )
                            )
                        )
                    ]
            , keyPressed = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
